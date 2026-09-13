export {
  areComponentsPresent,
  hasManyChildren,
  isLowercaseHtmlTag,
  parseTranslation,
  removeNumberSuffix,
  type FlatComponent,
};

/*
 * Accepted tag names, used by every pattern below:
 *
 *   [A-Za-z][A-Za-z0-9-]*(?=[\s/>])
 *
 * - PascalCase components ......... <NuxtLink>
 * - kebab-case and HTML tags ...... <my-component>, <strong>
 * - numeric suffix for repeats .... <NuxtLink-2>, <my-component-2>
 *
 * Underscores are excluded on purpose -- snake_case is not a Vue component convention.
 * The (?=[\s/>]) after the name is what enforces it: without it the attributes group
 * swallows the rest, so <my_component> parsed as a <my> tag with attributes "_component".
 *
 * --------------------------------------------
 *
 * We need to consider 3 cases:
 * 1 Opening tags (e.g. <NuxtLink>)
 * 2 Closing tags (e.g. </NuxtLink>)
 * 3 Self-closing tags (e.g. <NuxtLink />, which in this case could refer to a class as the logo in the login page)
 *
 * We will then inject the props directly in the template that call the Tanzlate component
 * in the case 3 it's more straightforward but in the case 1 and 2 we need to also keep the content inside the tag
 *
 * These are 3 RegEx that we can use to detect components or tags in the translation value.
 * All of them also support kebab-case, in case of an external library.
 */

const i18nRegex = {
  /*
   * Self-closing tags.
   *   <Tag />        <Tag ... />        <Tag-2 />
   *
   * Groups: 1 tag name, 2 attributes (unused)
   *
   * regex101: TODO save and paste link
   */
  selfClosingTags: /<([A-Za-z][A-Za-z0-9-]*)(?=[\s/>])\s*([^>]*)\s*\/>/g,

  /*
   * Any tag at all -- opening, closing or self-closing. Used only to answer
   * "does this string contain tags?", never to extract content.
   *   <Tag>          </Tag>             <Tag />
   *
   * Groups: 1 opening name, 2 attributes (unused), 3 self-closing slash, 4 closing name
   *
   * regex101: TODO save and paste link
   */
  allTypesOfTags:
    /<([A-Za-z][A-Za-z0-9-]*)(?=[\s/>])\s*([^>]*)\s*(\/?)>|<\/([A-Za-z][A-Za-z0-9-]*)\s*>/g,

  /*
   * A paired tag with everything between it. The \1 backreference is what ties the closing
   * tag to the opening one, so <b>x</b> matches but <b>x</i> does not.
   * The (?<!\/\s*) refuses a "/" just before ">", so <Icon /> is never read as the opening of
   * a later <Icon>...</Icon> -- otherwise both nodes merge into one.
   *   <Tag>inner</Tag>               <Tag-2>inner</Tag-2>
   *
   * Groups: 1 tag name, 2 attributes (unused), 3 inner content
   *
   * https://regex101.com/r/3SXgzD/1
   */
  openingAndClosingTagsWithContent:
    /<([A-Za-z][A-Za-z0-9-]*)(?=[\s/>])\s*([^>]*)(?<!\/\s*)>([\s\S]*?)<\/\1\s*>/g,
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
