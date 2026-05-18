<template>
  <Suspense>
    <I18nProvider :i18next-config="i18nConfig">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </I18nProvider>
  </Suspense>
</template>

<script setup lang="ts">
import type { Createi18nConfigParams } from '@tanzlate/vanilla';
import { I18nProvider } from '@tanzlate/vue';
import DE_TRANSLATION from './i18n/locales/de.json';
import EN_TRANSLATION from './i18n/locales/en.json';

const i18nConfig: Createi18nConfigParams = {
  fallbackLng: 'en',
  debug: true,
  lng: 'en',
  supportedLanguages: ['en', 'de'],
  interpolation: {
    escapeValue: false,
  },
  initImmediate: true,
  namespace: 'app_namespace',
  resources: {
    en: EN_TRANSLATION,
    de: DE_TRANSLATION,
  },
};
</script>
