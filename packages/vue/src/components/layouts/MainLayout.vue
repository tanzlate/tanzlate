<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables';

const { lang, i18nApp } = useI18n('home');
console.log('📟 - i18nApp → ', i18nApp.language);
// eslint-disable-next-line no-console
console.log('language in layout', lang);
</script>

<style scoped></style>
