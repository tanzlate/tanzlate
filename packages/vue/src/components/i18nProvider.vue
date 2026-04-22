<template>
  <Suspense>
    <slot />
  </Suspense>
</template>

<script setup lang="ts">
import { setupI18nContext } from '@/composables/context';
import { Createi18nConfigParams, useCoreContext } from '@tanzlate/step';

const i18nextConfigDefault: Createi18nConfigParams = {
  fallbackLng: 'en',
  debug: true,
  lng: 'en',
  supportedLanguages: ['en', 'de'],
  namespace: 'app_namespace',
  resources: {
    en: {
      app_namespace: {
        home: {
          welcome: 'Welcome to Nuxt 3 with <LangSwitcher>sdsds</LangSwitcher>',
          description: 'This is a simple example of how to use i18next with Nuxt 3 and Vue 3',
          interpolationExample:
            'This is an example of interpolation with a <link>link</link> and a <strong>strong</strong> tag.',
        },
      },
    },
    de: {
      app_namespace: {
        home: {
          welcome: 'Willkommen zu Nuxt 3 mit i18next',
          description:
            'Dies ist ein einfaches Beispiel dafür, wie man i18next mit Nuxt 3 und Vue 3 verwendet',
          interpolationExample:
            'Dies ist ein Beispiel für Interpolation mit einem <link>Link</link> und einem <strong>strong</strong>-Tag.',
        },
      },
    },
  },
};

const props = defineProps<{
  i18nextConfig?: Createi18nConfigParams;
}>();

// provide + onUnmounted MUST happen before the top-level await below
const resolve = setupI18nContext();

const ctx = await useCoreContext({
  config: props.i18nextConfig ?? i18nextConfigDefault,
  ssr: false,
});
resolve(ctx);
</script>

<style scoped></style>
