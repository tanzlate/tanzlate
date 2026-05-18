<template>
  <div>
    <button @click="changeLanguage('en')">{{ getFlagEmoji('gb') }} EN</button>
    <button @click="changeLanguage('de')">{{ getFlagEmoji('de') }} DE</button>
    <span> — {{ lang }}</span>
  </div>
</template>

<script setup lang="ts">
import { getFlagEmoji } from '@tanzlate/vanilla';
import { useI18n } from '@tanzlate/vue';

const { lang, changeLanguage } = useI18n('home');
</script>
