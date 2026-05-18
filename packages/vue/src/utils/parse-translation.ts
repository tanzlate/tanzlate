export {
  areComponentsPresent,
  hasManyChildren,
  isLowercaseHtmlTag,
  parseTranslation,
  removeNumberSuffix,
  type FlatComponent,
};

/**
 * TAG_NAME is used to build the regexes
 * - It matches tag names like:
 *   - PascalCase: <NuxtLink>
 *   - kebab-case: <my-component> or HTML tags like <strong>
 *   - Component with numeric suffixes: <NuxtLink-1>, <my-component-2>
 */
const TAG_NAME = '([A-Za-z][\\w-]*)'; // allows PascalCase, kebab-case, and suffixes like -1

const i18nRegex = {
  /*
   * We need to consider different cases:
   * 1 Opening tags (e.g. <NuxtLink>)
   * 2 Closing tags (e.g. </NuxtLink>)
   * 3 Self-closing tags (e.g. <NuxtLink />, which in this case could refer to a class as the logo in the login page)
   * 4 Tag with optional numeric suffix (e.g. <NuxtLink-1> or <NuxtLink-2>) if this component is used multiple times in the same translation string
   *
   * We will then inject the props directly in the template that call the  ̶R̶t̶T̶r̶a̶n̶s̶l̶a̶t̶e̶ Translate component
   * in the case 3 it's more straightforward but in the case 1 and 2 we need to also keep the content inside the tag
   *
   * These are 3 RegEx that we can use to detect components or tags in the translation value
   * All of them also support snake-case in case of third-party components
   *
   */

  TAG_NAME: '([A-Za-z][\\w-]*)', // allows PascalCase, kebab-case, and suffixes like -1

  // selfClosingAndOpeningTagsOnly: new RegExp(`<${TAG_NAME}\\s*/>`, 'g'),

  /**
   * Matches self-closing tags
   * E.g. <Tag ... />
   * Or in the case of multiple same tags with suffixes: <Tag-1 ... />
   *
   * Groups:
   *  1: tag name
   *  2: attributes (unused)
   */
  selfClosingTags: new RegExp(`<${TAG_NAME}\\s*([^>]*)\\s*/>`, 'g'),

  // selfClosingOpeningAndClosingTags: new RegExp(
  //   `<${TAG_NAME}\\s*([^>]*)\\s*(?:/)?>(?:</${TAG_NAME}\\s*>)?|</${TAG_NAME}\\s*>`,
  //   'g',
  // ),

  /**
   * Matches all types of tags: opening, closing, and self-closing
   * E.g. <Tag ...>, </Tag>, <Tag ... />
   * Or in the case of multiple same tags with suffixes: <Tag-1 ...>, </Tag-1>, <Tag-1 ... />
   *
   * Used for recursive parsing when we need to find all tags in a string
   *
   * Groups:
   *  1: opening/self-closing tag name
   *  2: attributes (unused)
   *  3: self-closing slash (if any)
   *  4: closing tag name
   */
  allTypesOfTags: new RegExp(`<${TAG_NAME}\\s*([^>]*)\\s*(/?)>|</${TAG_NAME}\\s*>`, 'g'),

  // Paired OR self-closing, with content captured when paired.
  // Groups:
  //  1: paired tag name, 2: attributes (unused), 3: inner content
  //  4: self-closing tag name
  allTagsWithContent: new RegExp(
    `<${TAG_NAME}\\s*([^>]*)\\s*(?:/)?>([\\s\\S]*?)</\\1\\s*>|<${TAG_NAME}\\s*/>`,
    'g',
  ),

  /**
   * Matches opening and closing tags, and captures inner content.
   * E.g. <Tag ...>inner</Tag>
   * Or in the case of multiple same tags with suffixes: <Tag-1 ...>inner</Tag-1>
   *
   * Groups:
   *  1: tag name
   *  2: attributes (unused)
   *  3: inner content
   */
  openingAndClosingTagsWithContent: new RegExp(
    `<${TAG_NAME}\\s*([^>]*)\\s*(?:/)?>([\\s\\S]*?)</\\1\\s*>`,
    'g',
  ),

  standaloneTags: new RegExp(`<${TAG_NAME}\\s*([^>]*)\\s*(?:/)?>(?:</\\1\\s*>)?`, 'g'),
};

/**
 * Types
 */
export interface TagObject {
  tag: string;
  content?: TagObject[] | string;
}

interface FlatComponent {
  tag: string;
  content: string;
}

export type ParsedResult = (string | TagObject)[]; // | ParsedResult[]

/**
 * Utility to check if a parsed tag object has multiple children
 *
 * @param {TagObject} element
 * @returns {boolean}
 */
function hasManyChildren(element: TagObject): boolean {
  if (!element.content) {
    return false;
  }
  return Array.isArray(element.content);
}

/*
 * Used to handle cases when a translation string contains multiple tags with the same name
 * e.g. "<NuxtLink>Wilkommen</NuxtLink> <NuxtLink-2>zurück</NuxtLink-2>""
 * We remove the hyphen and the number to only render the real tag name
 */
function removeNumberSuffix(str: string) {
  return str.replace(/-\d+$/, ''); // only at the end
}

/*
 * Will return an array of strings of tags or null
 * Example: ["<NuxtLink>","</NuxtLink>"]
 */
function areComponentsPresent(translationString: string): string[] | null {
  return translationString.match(i18nRegex.allTypesOfTags);
}

function isLowercaseHtmlTag(name: string) {
  return /^[a-z]/.test(name);
}

// function isSelfClosingTag(str: string): boolean {
//   const selfClosingTags = str.match(i18nRegex.selfClosingTags);
//   return selfClosingTags ? selfClosingTags.includes(str) : false;
// }

/*
 * Parse a given translation string and return an array of strings and objects
 * e.g. for a key
 * "Wunderbar! <NuxtLink>The customer <strong>{{ customer.name }}</strong></NuxtLink> hat den <NuxtLink-2>Kurs</NuxtLink-2> erfolgreich absolviert.",
 *
 * Will return
 * [
 *   'Wunderbar! ',
 *   {
 *     tag: 'NuxtLink',
 *     content: [
 *       'The customer ',
 *       {
 *         tag: 'strong',
 *         content: 'Arthur',
 *       },
 *     ],
 *   },
 *   ' hat den ',
 *   {
 *     tag: 'NuxtLink-2',
 *     content: 'Kurs',
 *   },
 *   ' erfolgreich absolviert.',
 * ]
 */

function parseTranslation(translationString: string): ParsedResult {
  const result: ParsedResult = [];

  // Explicit, readable patterns (support kebab-case and -1 suffixes)
  const PAIRED_RE = i18nRegex.openingAndClosingTagsWithContent;
  const SELF_RE = i18nRegex.selfClosingTags;

  let cursor = 0;

  // Find the next earliest tag (paired or self-closing) from a given position
  function findNext(from: number) {
    PAIRED_RE.lastIndex = from;
    SELF_RE.lastIndex = from;

    const paired = PAIRED_RE.exec(translationString);

    const self = SELF_RE.exec(translationString);

    // choose whichever starts earlier; if equal, prefer paired (so <X>…</X> wins over <X/> at same spot)
    const pick =
      paired && self
        ? paired.index <= self.index
          ? { kind: 'paired', m: paired }
          : { kind: 'self', m: self }
        : paired
          ? { kind: 'paired', m: paired }
          : self
            ? { kind: 'self', m: self }
            : null;

    if (!pick) return null;

    const start = pick.m.index;
    const end = (pick.kind === 'paired' ? PAIRED_RE : SELF_RE).lastIndex;

    if (pick.kind === 'paired') {
      const tagName = pick.m[1]; // name for paired
      const inner = pick.m[3] ?? ''; // inner content
      return { kind: 'paired' as const, tagName, inner, start, end };
    } else {
      const tagName = pick.m[1]; // name for self-closing
      return { kind: 'self' as const, tagName, start, end };
    }
  }

  while (cursor < translationString.length) {
    const next = findNext(cursor);
    if (!next) break;

    // push plain text before this tag
    if (next.start > cursor) {
      result.push(translationString.slice(cursor, next.start));
    }

    if (next.kind === 'self') {
      result.push({ tag: next.tagName });
    } else {
      // paired tag
      if (next.inner && areComponentsPresent(next.inner)) {
        result.push({
          tag: next.tagName,
          content: parseTranslation(next.inner) as string | TagObject[],
        });
      } else {
        result.push({ tag: next.tagName, content: (next.inner ?? '').trim() });
      }
    }

    cursor = next.end;
  }

  // trailing text
  if (cursor < translationString.length) {
    result.push(translationString.slice(cursor));
  }

  return result;
}
