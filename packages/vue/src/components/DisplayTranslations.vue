<template>
  <div>DisplayTranslations - {{ cT('welcome') }}</div>
  <div>
    DisplayTranslations - {{ cT('welcome') }}

    <Tanzlate
      :c-translate="cT"
      i18n-key="welcome"
      :components="{
        LangSwitcher: { label: 'Language Switcher' },
      }"
    />
  </div>
  <div>
    DisplayTranslations -
    {{ JSON.stringify(cT('componentInterpolationExample', { test: 'https://reteach.io' })) }}
  </div>
  <!-- <div>Current Language: {{ language }}</div> -->
  <div>
    <!-- <Translate
      :c-translate="cT"
      i18n-key="componentInterpolationExample"
      :components="{
        ColoredLabel: { color: labelColor, label: 'Blue Label' },
        'ColoredLabel-1': { color: labelColor, label: 'Red Label' },
      }"
      :values="{ test: 'https://reteach.io' }"
    /> -->
    <div style="padding: 20px; border: 4px solid blue">
      <Translate
        :c-translate="cT"
        :translation-value="cT('componentInterpolationExample', { test: 'https://reteach.io' })"
        i18n-key="componentInterpolationExample"
        :components="{
          ColoredLabel: {
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            label: 'Blue Label',
          },
          'ColoredLabel-1': { color: labelColor, label: 'Red Label' },
          a: { href: 'https://reteach.io' },
          span: { onClick: onClickT },
        }"
        :values="{ test: 'https://reteach.io' }"
      />
    </div>
    <div>Style the div above with a blue border</div>
    <!-- <div style="padding: 20px; border: 4px solid green">
      <Tanzlate
        :c-translate="cT"
        i18n-key="componentInterpolationExample"
        :components="{
          ColoredLabel: { color: labelColor, label: 'Blue Label' },
          'ColoredLabel-1': { color: labelColor, label: 'Red Label' },
          a: { href: 'https://reteach.io' },
        }"
        :values="{ test: 'https://reteach.io' }"
      />
    </div> -->
    <div>Style the div above with a green border</div>

    <hr />
    <!-- <Translate2
      :c-translate="cT"
      i18n-key="componentInterpolationExample"
      :components="{
        ColoredLabel: { color: labelColor, label: 'Blue Label' },
        'ColoredLabel-1': { color: labelColor, label: 'Red wcxscxLabel' },
      }"
    /> -->
    <input type="color" v-model="labelColor" />
  </div>
</template>

<script setup lang="ts">
import Translate from '@/components/translate/Translate';
import { useI18n } from '@/composables/context';
import { ref, watch } from 'vue';
import Tanzlate from './translate/Tanzlate';

const { cT } = useI18n('home');
function onClickT() {
  // eslint-disable-next-line no-alert
  alert('Span clicked!');
}
watch(
  () => cT,
  () => {
    // eslint-disable-next-line no-console
    console.log('cT changed - likely the language changed');
  },
);
const labelColor = ref('#f00');
</script>
