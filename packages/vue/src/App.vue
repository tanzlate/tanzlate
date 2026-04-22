<script setup lang="ts">
import { Createi18nConfigParams } from '@tanzlate/step';
import i18nProvider from './components/i18nProvider.ts';
import MainLayout from './components/layouts/MainLayout.vue';
import HomePage from './pages/HomePage.vue';

import DE_TRANSLATION from '../i18n/locales/de.json';
import EN_TRANSLATION from '../i18n/locales/en.json';

const i18nextConfigDefault: Createi18nConfigParams = {
  fallbackLng: 'en',
  debug: true,
  lng: 'en',
  supportedLanguages: ['en', 'de'],
  interpolation: {
    escapeValue: false,
  },
  initAsync: false,
  namespace: 'app_namespace',
  resources: {
    en: EN_TRANSLATION,
    de: DE_TRANSLATION,
  },
};
</script>

<template>
  <Suspense>
    <i18nProvider :i18nextConfig="i18nextConfigDefault">
      <MainLayout>
        <HomePage />
      </MainLayout>
    </i18nProvider>
  </Suspense>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    /* display: flex; */
    /* place-items: center; */
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
