import {
  areComponentsPresent,
  isLowercaseHtmlTag,
  ParsedResult,
  parseTranslation,
  removeNumberSuffix,
  TagObject,
} from '@/utils/parse-translation';
import { cTFunc } from '@tanzlate/step';
import { TOptions } from 'i18next';
import { isString } from 'unreadable-typescript';
import { computed, defineAsyncComponent, defineComponent, h, PropType, VNode } from 'vue';
import { resolveRegistered } from './component-registry';

type ComponentPropValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | object
  | Date
  | Array<string | number | boolean | null | undefined | object | Date | symbol>
  | symbol;

type ComponentsProps = {
  [name: string]: { [key: string]: ComponentPropValue } | null;
};

// type ComponentsProps = VNodeProps &
//   HTMLAttributes & {
//     [name: string]: (VNodeProps & HTMLAttributes & { [key: string]: unknown }) | null;
//   };

// TODO-NUXT-3: https://www.notion.so/reteach/Interpolation-of-href-HTML-tags-186dffa13e1d4536838ed65b30849cbb?pvs=4
// and PR https://github.com/reteach/reteach-app/pull/3159 + https://github.com/reteach/reteach-app/pull/3853
// type ComponentsProps = Record<string, HTMLAttributes>;

/*
 * TODO-NUXT-3: Breaking changes in Render Function API and Functional Components
 * https://v3-migration.vuejs.org/breaking-changes/render-function-api.html
 * https://v3-migration.vuejs.org/breaking-changes/functional-components.html
 */

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Tanzlate',
  props: {
    /**
     * (required)
     * Current context translation function
     */
    cTranslate: {
      type: Function as PropType<cTFunc>,
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
     *   :cTranslate="t"
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
      const { translationValue, cTranslate, i18nKey, values } = props;
      if (translationValue) {
        return translationValue;
      }

      if (values) {
        return cTranslate(i18nKey, values);
      }

      return cTranslate(i18nKey);
    });

    /**
     * 2. Test if the translation string contains component tags
     */
    const hasTags = computed(() => !!areComponentsPresent(translationValue.value));

    // 3. Parse the translation string into a structured format
    const parsedTranslation = computed<ParsedResult>(() =>
      parseTranslation(translationValue.value),
    );

    /**
     * 2. If no tags are present, we return the translation string
     * Meaning this component could be used as a simple translation component
     */
    if (!areComponentsPresent(translationValue.value)) {
      return () => translationValue.value;
    }

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

      const componentProps = props.components[original] ?? undefined;

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

      // TODO: ?
      // Extract event listeners (e.g., @click)
      // const eventListeners = props?.value.onClick || {};
      const ElementComponent = defineAsyncComponent(() => import(`@/components/${fileName}.vue`));

      return h(
        ElementComponent,
        componentProps,
        // attrs,
        // on: eventListeners,
        elementContent,
      );
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
