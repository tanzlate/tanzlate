<template>
  <ClientOnly>
    <LangSwitcher />
    <input v-model="labelColor" type="color" />

    <h1>
      <Tanzlate :t-z="tanz" i18n-key="welcome" />
    </h1>

    <Tanzlate :t-z="tanz" i18n-key="description" />

    <span>{{ result }}</span>

    <Tanzlate
      :t-z="tanz"
      i18n-key="interpolationExample"
      :values="{ test: 'https://reteach.io' }"
    />

    <Tanzlate
      :t-z="tanz"
      i18n-key="componentInterpolationExample"
      :components="{
        ColoredLabel: {
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          label: 'Blue Label',
        },
        'ColoredLabel-1': { color: labelColor, label: 'Red Label' },
        a: { href: 'https://reteach.io' },
      }"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { registerComponent, Tanzlate, useI18n } from '@tanzlate/vue';
import { ref } from 'vue';
import ColoredLabel from '~/components/ColoredLabel.vue';
import LangSwitcher from '~/components/LangSwitcher.vue';

registerComponent('ColoredLabel', ColoredLabel);

const result = ref('no result yet');
const { tanz } = useI18n('home');
const labelColor = ref('#ff0000');
</script>
