/*
 * Runs the experimental parser against the current one on every string that exists in this
 * repo, plus the edge cases. Both must agree; if they ever don't, one of them is wrong.
 */
import { describe, expect, it } from 'vitest';
import { parseTranslation as current } from './parse-translation';
import { parseTranslation as experimental } from './parse-translation.experimental';

const strings: [string, string][] = [
  ['nuxt welcome', 'Welcome to tanzlate with <LangSwitcher>switch language</LangSwitcher>'],
  ['nuxt description', 'A simple <b>example</b> of tanzlate in a Nuxt app'],
  [
    'nuxt interpolationExample',
    'Interpolation with a <a target="_blank" href="{{- test}}">link</a> and a <strong>strong</strong> tag.',
  ],
  [
    'nuxt componentInterpolation',
    'An example of <ColoredLabel /> component <b>interpolation</b> with a <ColoredLabel-1>colored label</ColoredLabel-1>. And a <a>link</a>.',
  ],
  [
    'nuxt lesson_sidebar_text',
    'The course <span class="text-primary">"{{name}}"</span> is set to <span class="text-primary">"{{ v }}"</span>. Rest.',
  ],
  [
    'reteach activity feed',
    '<NuxtLink><b>{{ customerName }}</b></NuxtLink> has completed <NuxtLink-2><b>{{ courseName }}</b></NuxtLink-2>.',
  ],
  ['reteach book_addon', 'Book the addon <a>Compliance Workflow</a>addon to activate.'],
  [
    'reteach custom_dpa',
    'Es ist notwendig, dass Sie den <a target="_blank" href="{{- url}}">Änderungen (PDF)</a> zustimmst.',
  ],
  [
    'README profile.updated',
    'Your <UserBadge /> has been updated. <AppButton>Need help?</AppButton>',
  ],
  [
    'README onboarding.welcome',
    'Hi {{ name }}! Your <UserBadge /> is ready. <AppButton>Start tour</AppButton>',
  ],
  ['docs help', 'Read the <a>documentation</a> or ask on <strong>Discord</strong>.'],
  ['docs links', 'Go to <NuxtLink>home</NuxtLink> or <NuxtLink-2>profile</NuxtLink-2>.'],
  [
    'docs course (nested)',
    'Wunderbar! <NuxtLink>The customer <strong>{{ name }}</strong></NuxtLink> finished the <NuxtLink-2>course</NuxtLink-2>.',
  ],
  ['plain sentence', 'Nothing to see here.'],
  ['self-closing alone', '<UserBadge />'],
  ['self-closing kebab', 'A <third-party-library-component /> here.'],
  ['siblings same name', '<b>one</b> and <b>two</b>'],
  ['self-closing then paired, same name', '<Icon /> then <Icon>label</Icon>'],
  ['three levels', '<Card><b>bold <i>italic</i></b></Card>'],
  ['snake_case (out of scope)', '<my_component>x</my_component>'],
  ['unclosed', 'before <b>after'],
  ['stray close', 'a </b> b'],
  ['empty', ''],
];

describe('experimental parser matches the current one', () => {
  it.each(strings)('%s', (_name, input) => {
    expect(experimental(input)).toEqual(current(input));
  });

  // Parity alone cannot catch a defect both parsers share, so pin the expected output.
  it('keeps a self-closing and a paired tag of the same name apart', () => {
    expect(experimental('<Icon /> then <Icon>label</Icon>')).toEqual([
      { tag: 'Icon' },
      ' then ',
      { tag: 'Icon', content: 'label' },
    ]);
  });

  it('terminates on nested tags (the case that hangs translation-parser.ts.OLD)', () => {
    const nested =
      '<NuxtLink><b>{{ customerName }}</b></NuxtLink> and <NuxtLink-2><b>x</b></NuxtLink-2>.';
    expect(() => experimental(nested)).not.toThrow();
    expect(experimental(nested)).toEqual(current(nested));
  });
});
