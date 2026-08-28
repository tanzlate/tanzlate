export {
  areComponentsPresent,
  hasManyChildren,
  isLowercaseHtmlTag,
  parseAttributes,
  parseTranslation,
  removeNumberSuffix,
};
export type { FlatComponent, ParsedResult, TagObject };

/**
 * Tag names accepted inside a translation string:
 * - PascalCase components: `<NuxtLink>`
 * - kebab-case components and HTML tags: `<my-component>`, `<strong>`
 * - a numeric suffix, to use the same component twice in one string: `<NuxtLink-2>`
 */
const TAG_NAME = '[A-Za-z][\\w-]*';

/** Matches an opening, closing, or self-closing tag. Used only to *detect* that tags exist. */
const ANY_TAG = new RegExp(`</?${TAG_NAME}\\s*[^>]*/?>`, 'g');

/**
 * Matches a single tag, consuming quoted attribute values as a unit so that a `>` inside
 * an attribute (`title="a > b"`) does not terminate the tag early.
 *
 * Groups: 1 = leading slash (closing tag), 2 = tag name, 3 = attributes, 4 = trailing slash.
 */
const TOKEN = new RegExp(`<(/)?(${TAG_NAME})((?:"[^"]*"|'[^']*'|[^>])*?)(/)?>`, 'g');

/**
 * A parsed tag.
 *
 * `attributes` holds any attributes written inline in the translation string, e.g.
 * `<a href="/help">`. In Vue 3 these go into the same object as props, so the renderer
 * merges them with the `components` map -- which wins on conflict.
 */
interface TagObject {
  tag: string;
  content?: TagObject[] | string;
  attributes?: Record<string, string>;
}

interface FlatComponent {
  tag: string;
  content: string;
}

type ParsedResult = (string | TagObject)[];

interface Token {
  kind: 'open' | 'close' | 'self';
  tag: string;
  attributes: string;
  start: number;
  end: number;
}

/** True when a parsed tag holds child tokens rather than a plain string. */
function hasManyChildren(element: TagObject): boolean {
  if (!element.content) {
    return false;
  }
  return Array.isArray(element.content);
}

/**
 * Strips the disambiguating suffix used when the same component appears more than once
 * in a single translation string: `NuxtLink-2` -> `NuxtLink`.
 */
function removeNumberSuffix(str: string): string {
  return str.replace(/-\d+$/, '');
}

/** Returns every tag found in the string, or null when there are none. */
function areComponentsPresent(translationString: string): string[] | null {
  ANY_TAG.lastIndex = 0;
  return translationString.match(ANY_TAG);
}

/**
 * Splits a raw attribute list into a record.
 *
 * Handles `name="value"`, `name='value'` and valueless `name` (which becomes `''`, matching
 * how HTML boolean attributes behave). Anything unparseable is skipped rather than throwing.
 */
function parseAttributes(raw: string): Record<string, string> | undefined {
  if (!raw) {
    return undefined;
  }

  const attrs: Record<string, string> = {};
  const ATTR = /([:@]?[A-Za-z_][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

  let match: RegExpExecArray | null;
  while ((match = ATTR.exec(raw)) !== null) {
    const [, name, dq, sq, bare] = match;
    attrs[name] = dq ?? sq ?? bare ?? '';
  }

  return Object.keys(attrs).length > 0 ? attrs : undefined;
}

/** A lowercase first letter means a native HTML element rather than a component. */
function isLowercaseHtmlTag(name: string): boolean {
  return /^[a-z]/.test(name);
}

/** Reads the next tag at or after `from`, or null when none remains. */
function nextToken(input: string, from: number): Token | null {
  TOKEN.lastIndex = from;
  const m = TOKEN.exec(input);
  if (!m) {
    return null;
  }

  const [raw, closing, tag, rawAttrs, selfClosing] = m;

  return {
    kind: closing ? 'close' : selfClosing ? 'self' : 'open',
    tag,
    attributes: (rawAttrs ?? '').trim(),
    start: m.index,
    end: m.index + raw.length,
  };
}

/**
 * Finds the `</tag>` that closes the tag opened at `from`, counting nested occurrences of
 * the same name so that `<b>a <b>c</b> d</b>` closes on the outer `</b>`, not the inner one.
 *
 * Returns null when the tag is never closed.
 */
function findClosing(
  input: string,
  tag: string,
  from: number,
): { inner: string; end: number } | null {
  let depth = 1;
  let cursor = from;

  for (;;) {
    const token = nextToken(input, cursor);
    if (!token) {
      return null;
    }

    if (token.tag === tag) {
      if (token.kind === 'open') {
        depth += 1;
      } else if (token.kind === 'close') {
        depth -= 1;
        if (depth === 0) {
          return { inner: input.slice(from, token.start), end: token.end };
        }
      }
    }

    cursor = token.end;
  }
}

/**
 * Parses a translation string into an array of plain strings and tag objects.
 *
 * @example
 * parseTranslation('<NuxtLink><b>Ada</b></NuxtLink> finished <NuxtLink-2>the course</NuxtLink-2>.')
 * // [
 * //   { tag: 'NuxtLink', content: [{ tag: 'b', content: 'Ada' }] },
 * //   ' finished ',
 * //   { tag: 'NuxtLink-2', content: 'the course' },
 * //   '.',
 * // ]
 *
 * Unclosed and stray closing tags are emitted as literal text rather than throwing, so a
 * malformed translation degrades to plain text instead of rendering nothing.
 */
function parseTranslation(translationString: string): ParsedResult {
  const result: ParsedResult = [];
  let cursor = 0;

  while (cursor < translationString.length) {
    const token = nextToken(translationString, cursor);
    if (!token) {
      break;
    }

    // A stray `</tag>` with no opener: keep it as text and move past it.
    if (token.kind === 'close') {
      if (token.start > cursor) {
        result.push(translationString.slice(cursor, token.start));
      }
      result.push(translationString.slice(token.start, token.end));
      cursor = token.end;
      continue;
    }

    if (token.start > cursor) {
      result.push(translationString.slice(cursor, token.start));
    }

    if (token.kind === 'self') {
      const attributes = parseAttributes(token.attributes);
      result.push(attributes ? { tag: token.tag, attributes } : { tag: token.tag });
      cursor = token.end;
      continue;
    }

    const closed = findClosing(translationString, token.tag, token.end);

    // Opened but never closed: emit the raw tag as text so the sentence survives.
    if (!closed) {
      result.push(translationString.slice(token.start, token.end));
      cursor = token.end;
      continue;
    }

    const node: TagObject = { tag: token.tag };
    const attributes = parseAttributes(token.attributes);
    if (attributes) {
      node.attributes = attributes;
    }
    node.content = areComponentsPresent(closed.inner)
      ? (parseTranslation(closed.inner) as TagObject[])
      : closed.inner.trim();

    result.push(node);
    cursor = closed.end;
  }

  if (cursor < translationString.length) {
    result.push(translationString.slice(cursor));
  }

  return result;
}
