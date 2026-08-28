export {
  areComponentsPresent,
  hasManyChildren,
  isLowercaseHtmlTag,
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
 * Matches a single tag.
 *
 * Tags in a translation string carry no attributes by design -- they exist so a translator
 * can read `<UserName />` in a natural sentence, and every prop comes from the `components`
 * map at the usage site. Quoted runs are still consumed as a unit so that a stray `>` inside
 * one cannot terminate a tag early and split the sentence.
 *
 * Groups: 1 = leading slash (closing tag), 2 = tag name, 3 = discarded, 4 = trailing slash.
 */
const TOKEN = new RegExp(`<(/)?(${TAG_NAME})((?:"[^"]*"|'[^']*'|[^>])*?)(/)?>`, 'g');

/** A parsed tag. Props are never carried here -- they come from the `components` map. */
interface TagObject {
  tag: string;
  content?: TagObject[] | string;
}

interface FlatComponent {
  tag: string;
  content: string;
}

type ParsedResult = (string | TagObject)[];

interface Token {
  kind: 'open' | 'close' | 'self';
  tag: string;
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

  const [raw, closing, tag, , selfClosing] = m;

  return {
    kind: closing ? 'close' : selfClosing ? 'self' : 'open',
    tag,
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
      result.push({ tag: token.tag });
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
