import { TFunc } from '@tanzlate/core';
import type { TOptions } from 'i18next';
import { isString } from 'unreadable-typescript';
import type { Component } from 'vue';
import {
  computed,
  defineComponent,
  Fragment,
  h,
  HTMLAttributes,
  PropType,
  resolveDynamicComponent,
  VNode,
  VNodeProps,
} from 'vue';
import {
  areComponentsPresent,
  isLowercaseHtmlTag,
  ParsedResult,
  parseTranslation,
  removeNumberSuffix,
  TagObject,
} from '../../utils/parse-translation';
import { isSafeUrl, URL_ATTRIBUTES } from '../../utils/sanitize-url';
import { resolveRegistered } from './component-registry';

/** One entry of the `components` map: attrs, event handlers, and props for a tag. */
type ComponentConfig = VNodeProps &
  HTMLAttributes & {
    attrs?: Record<string, unknown>;
    on?: Record<string, (...args: never[]) => unknown>;
    [key: string]: unknown;
  };

type ComponentsProps = Record<string, ComponentConfig | null>;

const warned = new Set<string>();

// Once per message, so a component in a loop doesn't flood the console.
function warnOnce(message: string): void {
  if (warned.has(message)) {
    return;
  }
  warned.add(message);
  // eslint-disable-next-line no-console
  console.warn(message);
}

/**
 * Splits a `components` entry into what h() wants.
 *
 * `{ attrs, on, ...props }` -- attrs are applied as-is, `on` keys become onClick-style
 * listeners, everything else is a prop. URL attributes are checked before rendering.
 */
function resolveConfig(config: ComponentConfig | null | undefined) {
  if (!config) {
    return undefined;
  }

  const { attrs, on, ...componentProps } = config;
  const data: Record<string, unknown> = { ...componentProps };

  if (attrs) {
    for (const [name, value] of Object.entries(attrs)) {
      if (
        URL_ATTRIBUTES.has(name.toLowerCase()) &&
        typeof value === 'string' &&
        !isSafeUrl(value)
      ) {
        warnOnce(`[tanzlate] dropped unsafe "${name}" URL.`);
        continue;
      }
      data[name] = value;
    }
  }

  if (on) {
    for (const [event, handler] of Object.entries(on)) {
      data[`on${event.charAt(0).toUpperCase()}${event.slice(1)}`] = handler;
    }
  }

  return Object.keys(data).length > 0 ? data : undefined;
}

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Tanzlate',
  props: {
    /**
     * (required)
     * Current context translation function
     */
    tZ: {
      type: Function as PropType<TFunc>,
      required: true,
    },
    /**
     * (required)
     * Translation key string to be translated
     */
    i18nKey: {
      type: String,
      required: true,
    },
    /**
     * Optional values to be passed to the translation function
     */
    values: {
      type: Object as PropType<TOptions>,
      // default: () => ({}),
      required: false,
    },
    /**
     * Object of components and their props to be used in the translation
     * Can be used for both Vue components and HTML tags
     *
     * Example:
     * <Translate
     *   :tZ="t"
     *   i18nKey="welcomeMessage"
     *   :values="{ name: 'John' }"
     *   :components="{
     *     ColoredLabel: { text: 'Hello' },
     *     NuxtLink: { to: '/about' },
     *     a: { href: 'https://example.com', target: '_blank' } // HTML tag
     *   }"
     * />
     */
    components: {
      type: Object as PropType<ComponentsProps>,
      default: () => ({}),
    },
    /**
     * Optional translation value string to override the translation function
     * Can be used to directly pass a translation string with tags to be parsed
     * instead of using a translation key
     * Mainly useful for testing purposes and edge cases
     *
     * TODO: Reactivity issues with i18n language change
     * this prop works better than using the translation function
     */
    translationValue: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    // 1. Get current translation
    const translationValue = computed(() => {
      const { translationValue, tZ, i18nKey, values } = props;
      if (translationValue) {
        return translationValue;
      }

      if (values) {
        return tZ(i18nKey, values);
      }

      return tZ(i18nKey);
    });

    /**
     * 2. Test if the translation string contains component tags
     */
    const hasTags = computed(() => !!areComponentsPresent(translationValue.value));

    // 3. Parse the translation string into a structured format
    const parsedTranslation = computed<ParsedResult>(() =>
      parseTranslation(translationValue.value),
    );

    /*
     * NOTE: the tags/no-tags decision must NOT be made here. `setup` runs once, so an early
     * return would freeze it for the component's lifetime -- a key that is untagged in the
     * first language and tagged in the next would never render its components after a
     * language switch. The render function below re-reads `hasTags` on every run instead.
     */

    /**
     * Normalize children components
     *
     */
    function normalizeChildren(content: TagObject['content']): (VNode | string)[] {
      if (!content) {
        return [];
      }
      if (Array.isArray(content)) {
        return content.map((item) => {
          if (isString(item) || typeof item === 'string') {
            return item;
          }

          return renderComponent(item);
        });
      }
      return [content];
    }

    /**
     * Description placeholder
     *
     * @param {TagObject} element
     * @returns {(VNode | string)}
     */
    function renderComponent(element: TagObject): VNode | string {
      const original = element.tag; // e.g. "ColoredLabel-1" or "strong"
      const fileName = removeNumberSuffix(original); // "ColoredLabel"

      const componentProps = resolveConfig(props.components[original]);

      // If the component content contains other nested tags, we recursively render them
      const elementContent = normalizeChildren(element.content) || [];
      // element.content && Array.isArray(element.content)
      //   ? element.content?.map(renderComponent)
      //   : element.content;

      // Check if the component is registered and if so, render it
      const registered = resolveRegistered(fileName);
      if (registered) {
        return h(registered, componentProps, elementContent);
      }

      // Check if it's an HTML tag (lowercase first letter)
      if (isLowercaseHtmlTag(fileName)) {
        const htmlTag = fileName as keyof HTMLElementTagNameMap;
        return h(htmlTag, componentProps, elementContent);
      }

      /*
       * Not in our registry and not an HTML tag -- try the app's own components. Nuxt
       * auto-registers everything in components/, and app.component() does the same, so
       * <NuxtLink> and friends need no explicit registerComponent call.
       *
       * resolveDynamicComponent hands back the name unchanged when nothing matches.
       */
      const globallyRegistered = resolveDynamicComponent(fileName);
      if (typeof globallyRegistered !== 'string') {
        return h(globallyRegistered as Component, componentProps, elementContent);
      }

      // Nothing anywhere. Warn and render the children so the sentence stays readable.
      warnOnce(
        `[tanzlate] <${original}> is not registered, so it cannot be rendered. ` +
          `Register it with registerComponent('${fileName}', ${fileName}), or make it ` +
          `globally available in your app. ` +
          `The ':components' prop only supplies props -- it does not resolve components.`,
      );

      return h(Fragment, elementContent);
    }

    // function renderParsedTranslation(parsed: ParsedResult): Array<VNode | string> | string {
    //   // if (isString(parsed)) {
    //   //   return parsed;
    //   // }
    //   // if (typeof parsed === 'string') {
    //   //   return parsed;
    //   // }
    //   return parsed.map((element) => {
    //     // console.log('element', element);
    //     // if (isString(element)) {
    //     //   return element;
    //     // }
    //     // if (typeof element === 'string') {
    //     //   return element;
    //     // }
    //     return renderComponent(element);
    //   });
    // }

    return () => {
      if (hasTags.value) {
        return parsedTranslation.value.map((element) => {
          if (isString(element) || typeof element === 'string') {
            return element;
          }

          return renderComponent(element);
        });
      }
      return translationValue.value;
    };
  },
});
