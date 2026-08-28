import { TFunc } from '@tanzlate/core';
import { TOptions } from 'i18next';
import { isString } from 'unreadable-typescript';
import {
  computed,
  defineComponent,
  Fragment,
  h,
  HTMLAttributes,
  PropType,
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
import { resolveRegistered } from './component-registry';

type ComponentsProps = VNodeProps &
  HTMLAttributes & {
    [name: string]: (VNodeProps & HTMLAttributes & { [key: string]: unknown }) | null;
  };

/*
 * Attributes coming out of a translation string are filtered before they reach h().
 *
 * Two rules, both deliberately conservative:
 *
 * - Any name starting with "on" is refused. Vue binds `onClick` as a listener, and a plain
 *   `onclick` string falls through as a DOM attribute and executes, so both forms matter.
 *   This also refuses a prop that merely starts with "on" (e.g. `only`); pass those via
 *   `:components`, which is not filtered.
 *
 * - URL-bearing attributes are checked with the platform URL parser rather than a pattern.
 *   A denylist cannot win here: browsers strip control characters inside a scheme, so
 *   `java\tscript:` is a live javascript: URL that no naive regex matches. Parsing and
 *   allowlisting the resulting protocol closes that whole class.
 */
const EVENT_HANDLER = /^on/i;
const URL_ATTRIBUTE = new Set(['href', 'src', 'action', 'formaction', 'xlink:href', 'poster']);
const SAFE_URL_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:', 'ftp:']);

/** Base used only to resolve relative URLs; never rendered. */
const RELATIVE_URL_BASE = 'https://tanzlate.invalid';

const warned = new Set<string>();

/** Emits a warning once per message, so a component in a loop does not flood the console. */
function warnOnce(message: string): void {
  if (warned.has(message)) {
    return;
  }
  warned.add(message);
  // eslint-disable-next-line no-console
  console.warn(message);
}

/**
 * True when a URL resolves to a scheme that is safe to render.
 *
 * Relative URLs resolve against {@link RELATIVE_URL_BASE} and so inherit `https:`.
 * Anything the parser rejects outright is treated as unsafe.
 */
function isSafeUrl(value: string): boolean {
  try {
    return SAFE_URL_SCHEMES.has(new URL(value, RELATIVE_URL_BASE).protocol);
  } catch {
    return false;
  }
}

/**
 * Filters attributes parsed out of a translation string.
 *
 * Translation values are interpolated *before* the string is parsed, so an attribute can
 * carry user-supplied data. Anything refused here is dropped with a warning; the rest is
 * merged into the props object, where `:components` still takes precedence.
 */
function sanitizeAttributes(
  attributes: Record<string, string> | undefined,
  tag: string,
): Record<string, string> | undefined {
  if (!attributes) {
    return undefined;
  }

  const safe: Record<string, string> = {};

  for (const [name, value] of Object.entries(attributes)) {
    if (EVENT_HANDLER.test(name)) {
      warnOnce(
        `[tanzlate] ignoring "${name}" on <${tag}> -- attributes starting with "on" cannot ` +
          `come from a translation string. Pass it via the ':components' prop instead.`,
      );
      continue;
    }

    if (URL_ATTRIBUTE.has(name.toLowerCase()) && !isSafeUrl(value)) {
      warnOnce(
        `[tanzlate] ignoring "${name}" on <${tag}> -- only ` +
          `${[...SAFE_URL_SCHEMES].join(', ')} and relative URLs are allowed.`,
      );
      continue;
    }

    safe[name] = value;
  }

  return Object.keys(safe).length > 0 ? safe : undefined;
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

      // In Vue 3 attributes and props share one object: declared props bind as props,
      // the rest fall through as attributes. Attributes written in the translation string
      // are merged first so that `:components` wins on conflict.
      const inlineAttrs = sanitizeAttributes(element.attributes, original);
      const mapped = props.components[original] ?? undefined;
      const componentProps =
        inlineAttrs || mapped ? { ...(inlineAttrs ?? {}), ...(mapped ?? {}) } : undefined;

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
       * Unregistered, and not an HTML tag. There is nothing to resolve: a dynamic import
       * from this package would resolve against tanzlate's own source tree, not the host
       * app's, so it can never find the component. Warn loudly and render the children,
       * which keeps the sentence readable instead of silently dropping it.
       */
      warnOnce(
        `[tanzlate] <${original}> is not registered, so it cannot be rendered. ` +
          `Call registerComponent('${fileName}', ${fileName}) once at app startup. ` +
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
