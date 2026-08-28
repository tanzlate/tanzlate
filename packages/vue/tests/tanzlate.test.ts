import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp, defineComponent, h, nextTick, ref } from 'vue';
import Tanzlate from '../src/components/translate/Tanzlate';
import { registerComponent } from '../src/components/translate/component-registry';

/*
 * These render with createApp rather than @vue/test-utils on purpose: `shamefully-hoist`
 * leaves several Vue copies at the workspace root, and mount() loads a different one than
 * the component under test, which silently breaks reactivity across the boundary.
 */

const ColoredLabel = defineComponent({
  props: { color: { type: String, default: '' }, label: { type: String, default: '' } },
  setup: (p) => () => h('span', { style: `color:${p.color}` }, p.label),
});

registerComponent('ColoredLabel', ColoredLabel);

const mounted: { unmount: () => void }[] = [];
afterEach(() => {
  mounted.splice(0).forEach((a) => a.unmount());
  vi.restoreAllMocks();
});

function renderWith(tZ: () => string, components: Record<string, unknown> = {}) {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const app = createApp(
    defineComponent({
      setup: () => () => h(Tanzlate, { tZ, i18nKey: 'k', components } as never),
    }),
  );
  app.config.warnHandler = () => {};
  app.mount(el);
  mounted.push(app);

  return () => el.innerHTML.replace(/\n\s*/g, ' ');
}

const render = (str: string, components: Record<string, unknown> = {}) =>
  renderWith(() => str, components)();

describe('attributes written in the translation string', () => {
  it('renders href and target on a plain HTML tag', () => {
    expect(render('a <a target="_blank" href="https://reteach.io">link</a>')).toContain(
      '<a target="_blank" href="https://reteach.io">link</a>',
    );
  });

  it('lets :components override an inline attribute', () => {
    expect(
      render('<a href="https://from-string.example">x</a>', { a: { href: '/from-prop' } }),
    ).toContain('href="/from-prop"');
  });

  it('drops event handlers and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = render('<a onclick="alert(1)" href="/ok">x</a>');

    expect(html).not.toContain('onclick');
    expect(html).toContain('href="/ok"');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('event handler'));
  });

  it('drops javascript: URLs and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = render('<a href="javascript:alert(1)">x</a>');

    expect(html).not.toContain('javascript:');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('unsafe'));
  });
});

describe('unregistered component', () => {
  it('warns and still renders its children instead of an empty placeholder', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = render('Welcome to tanzlate with <LangSwitcher>switch language</LangSwitcher>');

    expect(html).toContain('switch language');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('is not registered'));
  });
});

describe('language switching', () => {
  it('renders components after switching from an untagged to a tagged translation', async () => {
    const lang = ref('en');
    const dict: Record<string, string> = { en: 'Hello', de: 'Hallo <b>Welt</b>' };

    const html = renderWith(() => dict[lang.value]);
    expect(html()).toContain('Hello');

    lang.value = 'de';
    await nextTick();

    expect(html()).toContain('<b>Welt</b>');
  });

  it('keeps rendering components when both languages are tagged', async () => {
    const lang = ref('en');
    const dict: Record<string, string> = { en: '<b>Hello</b>', de: '<b>Hallo</b>' };

    const html = renderWith(() => dict[lang.value]);
    expect(html()).toContain('<b>Hello</b>');

    lang.value = 'de';
    await nextTick();

    expect(html()).toContain('<b>Hallo</b>');
  });
});

describe('playground strings still render', () => {
  it('componentInterpolationExample', () => {
    const html = render(
      'An example of <ColoredLabel /> component <b>interpolation</b> with a <ColoredLabel-1>colored label</ColoredLabel-1>. And a <a>link</a>.',
      {
        ColoredLabel: { color: '#00f', label: 'Blue' },
        'ColoredLabel-1': { color: '#f00', label: 'Red' },
        a: { href: 'https://reteach.io' },
      },
    );

    expect(html).toContain('Blue');
    expect(html).toContain('Red');
    expect(html).toContain('<b>interpolation</b>');
    expect(html).toContain('<a href="https://reteach.io">link</a>');
  });

  it('description', () => {
    expect(render('A simple <b>example</b> of tanzlate in a Nuxt app')).toContain(
      'A simple <b>example</b> of tanzlate in a Nuxt app',
    );
  });
});
