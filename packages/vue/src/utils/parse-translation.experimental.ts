/*
 * EXPERIMENTAL -- not wired into anything. Kept alongside parse-translation.ts so the two
 * shapes can be compared. Delete whichever loses.
 *
 * The idea: one pattern that matches EITHER a paired tag or a self-closing one, driven by a
 * single exec loop. RegExp.exec already returns the leftmost match, so there is no need to
 * run two patterns and compare which starts first.
 */

export { areComponentsPresent, isLowercaseHtmlTag, parseTranslation, removeNumberSuffix };
export type { ParsedResult, TagObject };

/*
 * Tag names: PascalCase, kebab-case, and -N suffixes for a repeated component.
 * The (?=[\s/>]) stops <my_component> parsing as a <my> tag with attributes "_component".
 */
const TAG_NAME = String.raw`[A-Za-z][A-Za-z0-9-]*(?=[\s/>])`;

/*
 * Left branch  -- paired:        <Tag ...>inner</Tag>     groups 1 name, 2 inner
 * Right branch -- self-closing:  <Tag ... />              group  3 name
 *
 * Built fresh per call on purpose: a module-level /g regex carries lastIndex, and the
 * recursive call below would overwrite the outer loop's position. That is a real hang,
 * not a theoretical one.
 */
const TAG_PATTERN = String.raw`<(${TAG_NAME})[^>]*(?<!\/\s*)>([\s\S]*?)<\/\1\s*>|<(${TAG_NAME})[^>]*\/>`;

/* Any tag at all, used only to answer "are there tags in here?". */
const ANY_TAG = String.raw`<\/?${TAG_NAME}[^>]*\/?>`;

interface TagObject {
  tag: string;
  content?: TagObject[] | string;
}

type ParsedResult = (string | TagObject)[];

/*
 * Array of the tags found, or null.
 * Example: ["<NuxtLink>", "</NuxtLink>"]
 */
function areComponentsPresent(translationString: string): string[] | null {
  return translationString.match(new RegExp(ANY_TAG, 'g'));
}

// Lowercase first letter means a native HTML element, not a component.
function isLowercaseHtmlTag(name: string): boolean {
  return /^[a-z]/.test(name);
}

/*
 * Strips the suffix used when the same component appears twice in one string.
 * <NuxtLink-2> -> NuxtLink
 */
function removeNumberSuffix(str: string): string {
  return str.replace(/-\d+$/, '');
}

/*
 * Parse a translation string into text segments and tag objects.
 *
 * "Wunderbar! <NuxtLink>The customer <strong>Ada</strong></NuxtLink> hat den <NuxtLink-2>Kurs</NuxtLink-2> absolviert."
 *
 * [
 *   'Wunderbar! ',
 *   { tag: 'NuxtLink', content: ['The customer ', { tag: 'strong', content: 'Ada' }] },
 *   ' hat den ',
 *   { tag: 'NuxtLink-2', content: 'Kurs' },
 *   ' absolviert.',
 * ]
 */
function parseTranslation(translationString: string): ParsedResult {
  const tags = new RegExp(TAG_PATTERN, 'g');
  const result: ParsedResult = [];
  let cursor = 0;

  for (let match = tags.exec(translationString); match; match = tags.exec(translationString)) {
    if (match.index > cursor) {
      result.push(translationString.slice(cursor, match.index));
    }

    const [, pairedName, inner, selfClosingName] = match;

    if (pairedName) {
      result.push({
        tag: pairedName,
        content: areComponentsPresent(inner)
          ? (parseTranslation(inner) as TagObject[])
          : inner.trim(),
      });
    } else {
      result.push({ tag: selfClosingName });
    }

    cursor = tags.lastIndex;
  }

  if (cursor < translationString.length) {
    result.push(translationString.slice(cursor));
  }

  return result;
}
