import { CoreContext, Createi18nConfigParams, useCoreContext } from '@tanzlate/vanilla';
import { defineComponent, h, PropType, Suspense } from 'vue';
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
  async setup(props, { slots }) {
    if (!props.i18nextConfig && !props.i18nContext) {
      throw new Error('[tanzlate] I18nProvider requires either i18next-config or i18n-context.');
    }

    // provide + onUnmounted MUST happen before any await
    const resolve = setupI18nContext();

    const ctx =
      props.i18nContext ?? (await useCoreContext({ config: props.i18nextConfig!, ssr: false }));

    resolve(ctx);

    return () => h(Suspense, () => h('div', { class: 'i18n-provider' }, slots.default?.()));
  },
});
