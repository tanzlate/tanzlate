import { describe, expect, it } from 'vitest';
import {
  areComponentsPresent,
  hasManyChildren,
  isLowercaseHtmlTag,
  parseTranslation,
  removeNumberSuffix,
} from './parse-translation';

describe('parseTranslation', () => {
  it('returns the string untouched when there are no tags', () => {
    expect(parseTranslation('Just a sentence.')).toEqual(['Just a sentence.']);
  });

  it('parses a self-closing tag', () => {
    expect(parseTranslation('Your <UserBadge /> is ready.')).toEqual([
      'Your ',
      { tag: 'UserBadge' },
      ' is ready.',
    ]);
  });

  it('parses a paired tag with plain content', () => {
    expect(parseTranslation('<AppButton>Start tour</AppButton>')).toEqual([
      { tag: 'AppButton', content: 'Start tour' },
    ]);
  });

  it('parses kebab-case tags', () => {
    expect(parseTranslation('<my-component>hi</my-component>')).toEqual([
      { tag: 'my-component', content: 'hi' },
    ]);
  });

  // The string that shipped in the reteach activity feed.
  it('parses the production activity-feed string', () => {
    const input =
      '<NuxtLink><b>{{ customerName }}</b></NuxtLink> has successfully completed the course <NuxtLink-2><b> {{ courseName }}</b></NuxtLink-2>.';

    expect(parseTranslation(input)).toEqual([
      { tag: 'NuxtLink', content: [{ tag: 'b', content: '{{ customerName }}' }] },
      ' has successfully completed the course ',
      { tag: 'NuxtLink-2', content: [{ tag: 'b', content: '{{ courseName }}' }] },
      '.',
    ]);
  });

  describe('same-name nesting', () => {
    it('closes on the outer tag, not the first inner one', () => {
      expect(parseTranslation('<b>a <b>c</b> d</b>')).toEqual([
        { tag: 'b', content: ['a ', { tag: 'b', content: 'c' }, ' d'] },
      ]);
    });

    it('handles a component nested inside itself', () => {
      expect(parseTranslation('<Box><Box>inner</Box></Box>')).toEqual([
        { tag: 'Box', content: [{ tag: 'Box', content: 'inner' }] },
      ]);
    });

    it('handles siblings of the same name', () => {
      expect(parseTranslation('<b>one</b> and <b>two</b>')).toEqual([
        { tag: 'b', content: 'one' },
        ' and ',
        { tag: 'b', content: 'two' },
      ]);
    });
  });

  describe('attributes', () => {
    it('captures attributes without rendering them', () => {
      expect(parseTranslation('<a href="https://x.com">link</a>')).toEqual([
        { tag: 'a', attributes: 'href="https://x.com"', content: 'link' },
      ]);
    });

    it('does not end the tag on a > inside a quoted attribute value', () => {
      expect(parseTranslation('<span title="a > b">text</span>')).toEqual([
        { tag: 'span', attributes: 'title="a > b"', content: 'text' },
      ]);
    });

    it('captures attributes on self-closing tags', () => {
      expect(parseTranslation('<Icon name="check" />')).toEqual([
        { tag: 'Icon', attributes: 'name="check"' },
      ]);
    });
  });

  describe('malformed input degrades to text', () => {
    it('keeps an unclosed tag as literal text', () => {
      expect(parseTranslation('before <b>after')).toEqual(['before ', '<b>', 'after']);
    });

    it('keeps a stray closing tag as literal text', () => {
      expect(parseTranslation('a </b> b')).toEqual(['a ', '</b>', ' b']);
    });
  });

  it('parses deeply nested mixed tags', () => {
    expect(parseTranslation('<Card><b>bold <i>and italic</i></b></Card>')).toEqual([
      {
        tag: 'Card',
        content: [{ tag: 'b', content: ['bold ', { tag: 'i', content: 'and italic' }] }],
      },
    ]);
  });
});

describe('areComponentsPresent', () => {
  it('returns null for a plain sentence', () => {
    expect(areComponentsPresent('no tags here')).toBeNull();
  });

  it('finds opening, closing and self-closing tags', () => {
    expect(areComponentsPresent('<a>x</a> <Icon />')).toEqual(['<a>', '</a>', '<Icon />']);
  });

  it('is not affected by a previous call (no lastIndex leak)', () => {
    const input = '<a>x</a>';
    expect(areComponentsPresent(input)).toEqual(areComponentsPresent(input));
  });
});

describe('removeNumberSuffix', () => {
  it('strips a trailing numeric suffix', () => {
    expect(removeNumberSuffix('NuxtLink-2')).toBe('NuxtLink');
  });

  it('leaves kebab-case names without a numeric suffix alone', () => {
    expect(removeNumberSuffix('my-component')).toBe('my-component');
  });

  it('only strips at the end', () => {
    expect(removeNumberSuffix('Link-2-Button')).toBe('Link-2-Button');
  });
});

describe('isLowercaseHtmlTag', () => {
  it('treats a lowercase first letter as an HTML tag', () => {
    expect(isLowercaseHtmlTag('strong')).toBe(true);
  });

  it('treats PascalCase as a component', () => {
    expect(isLowercaseHtmlTag('UserBadge')).toBe(false);
  });
});

describe('hasManyChildren', () => {
  it('is true when content is an array', () => {
    expect(hasManyChildren({ tag: 'b', content: [{ tag: 'i', content: 'x' }] })).toBe(true);
  });

  it('is false for plain string content', () => {
    expect(hasManyChildren({ tag: 'b', content: 'x' })).toBe(false);
  });

  it('is false when there is no content', () => {
    expect(hasManyChildren({ tag: 'Icon' })).toBe(false);
  });
});
