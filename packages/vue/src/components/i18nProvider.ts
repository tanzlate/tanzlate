import { CoreContext, Createi18nConfigParams, useCoreContext } from '@tanzlate/vanilla';
import { defineComponent, h, PropType, Suspense, VNode } from 'vue';
import { setupI18nContext } from '../composables/context';

export default defineComponent({
  name: 'I18nProvider',
  props: {
    i18nextConfig: {
      type: Object as PropType<Createi18nConfigParams>,
      required: false,
    },
    i18nContext: {
      type: Object as PropType<CoreContext>,
      required: false,
    },
  },
  // Deliberately not an `async setup`. Returning a promise only on the branch
  // that actually awaits keeps the `i18n-context` path synchronous, so callers
  // who already built their context do not need an outer <Suspense>.
  setup(props, { slots }): (() => VNode) | Promise<() => VNode> {
    if (!props.i18nextConfig && !props.i18nContext) {
      throw new Error('[tanzlate] I18nProvider requires either i18next-config or i18n-context.');
    }

    // provide + onUnmounted MUST happen before any await
    const resolve = setupI18nContext();

    const render = () => h(Suspense, () => h('div', { class: 'i18n-provider' }, slots.default?.()));

    if (props.i18nContext) {
      resolve(props.i18nContext);
      return render;
    }

    return useCoreContext({ config: props.i18nextConfig!, ssr: false }).then((ctx) => {
      resolve(ctx);
      return render;
    });
  },
});
