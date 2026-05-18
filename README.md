# tanzlate

[![npm](https://img.shields.io/npm/v/@tanzlate/vue?color=519ea9&label=%40tanzlate%2Fvue)](https://www.npmjs.com/package/@tanzlate/vue)
[![npm](https://img.shields.io/npm/v/@tanzlate/vanilla?color=519ea9&label=%40tanzlate%2Fvanilla)](https://www.npmjs.com/package/@tanzlate/vanilla)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**i18n for Vue 3 and Nuxt — with full component interpolation.**

---

## Motivation

Translation is a cross-team process. It involves developers, translators, content writers, designers, and product managers — all needing to stay in sync around a common source of truth.

Most i18n libraries make this harder than it needs to be: the moment a translated sentence contains a link or a styled word, developers have to split it across multiple template slots and separate translation keys. Translators lose the full sentence context. Content writers can no longer validate what will actually appear on screen.

tanzlate keeps the whole sentence in one translation string — including any components or HTML tags inside it — so every stakeholder works from the same source.

|                                    | Translators     | Content Writers | Developers  |
| ---------------------------------- | --------------- | --------------- | ----------- |
| **Readable sentences**             | ✅ Full context | ✅ Full context | ✅          |
| **Namespace structure**            | ~               | ✅              | ✅          |
| **Component / HTML interpolation** | Natural syntax  | ✅ Full control | ✅ Flexible |

---

## Why tanzlate?

With a typical i18n library, putting a component inside a translated string requires slot gymnastics:

```vue
<!-- vue-i18n -->
<i18n-t keypath="profile.updated">
  <template #badge>
    <UserBadge :level="user.level" />
  </template>
  <template #action>
    <AppButton variant="ghost">{{ t('profile.help') }}</AppButton>
  </template>
</i18n-t>
```

The translation key can only hold the text around the slots — the label inside the button lives in a separate key. Translators lose the full sentence context.

With tanzlate the whole sentence stays in one string, written the way you'd write Vue template code:

```json
{
  "profile": {
    "updated": "Your <UserBadge /> has been updated. <AppButton>Need help?</AppButton>"
  }
}
```

```vue
<Tanzlate
  :t-z="tanz"
  i18n-key="updated"
  :components="{
    UserBadge: { level: user.level },
    AppButton: { variant: 'ghost' },
  }"
/>
```

Translators read a natural sentence — including the button label. Developers map tag names to the components they already use.

---

## Packages

| Package             | Purpose                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| `@tanzlate/core`    | Formatter types and utilities — usable in any JS environment            |
| `@tanzlate/vanilla` | Framework-agnostic i18next runtime (`useCoreContext`, `initI18nConfig`) |
| `@tanzlate/vue`     | Vue 3 / Nuxt integration (`I18nProvider`, `useI18n`, `<Tanzlate>`)      |

---

## Installation

```bash
# npm
npm install @tanzlate/vue @tanzlate/vanilla @tanzlate/core

# pnpm
pnpm add @tanzlate/vue @tanzlate/vanilla @tanzlate/core

# yarn
yarn add @tanzlate/vue @tanzlate/vanilla @tanzlate/core
```

---

## Quick start

### 1. Wrap your app with `I18nProvider`

```vue
<!-- app.vue -->
<template>
  <Suspense>
    <I18nProvider :i18next-config="i18nConfig">
      <RouterView />
    </I18nProvider>
  </Suspense>
</template>

<script setup lang="ts">
import { I18nProvider } from '@tanzlate/vue';
import type { Createi18nConfigParams } from '@tanzlate/vanilla';

const i18nConfig: Createi18nConfigParams = {
  fallbackLng: 'en',
  lng: 'en',
  supportedLanguages: ['en', 'de', 'fr'],
  namespace: 'app',
  resources: {
    en: {
      app: {
        /* ... */
      },
    },
    de: {
      app: {
        /* ... */
      },
    },
  },
};
</script>
```

### 2. Use `useI18n` in any component

```vue
<script setup lang="ts">
import { useI18n } from '@tanzlate/vue';

const { tanz, lang, changeLanguage } = useI18n('home');
</script>

<template>
  <p>{{ tanz('greeting') }}</p>
  <p>Current language: {{ lang }}</p>
  <button @click="changeLanguage('de')">DE</button>
</template>
```

---

## Component interpolation

The `<Tanzlate>` component parses a translated string and renders any tag as a real Vue component or HTML element — self-closing or with children, with or without props.

### Translation file

```json
{
  "onboarding": {
    "welcome": "Hi {{ name }}! Your <UserBadge /> is ready. <AppButton>Start tour</AppButton>"
  }
}
```

The tag syntax is intentionally close to Vue template syntax. Self-closing (`<UserBadge />`) and wrapping (`<AppButton>label</AppButton>`) both work, and nested components are supported.

### Passing props per use

```vue
<script setup lang="ts">
import { Tanzlate, useI18n } from '@tanzlate/vue';

const { tanz } = useI18n('onboarding');
</script>

<template>
  <Tanzlate
    :t-z="tanz"
    i18n-key="welcome"
    :values="{ name: user.name }"
    :components="{
      UserBadge: { level: user.level },
      AppButton: { variant: 'primary', onClick: startTour },
    }"
  />
</template>
```

### Component registry — register once, use everywhere

For components that appear in many translation strings, register them globally at app startup instead of passing them via `:components` on every usage:

```ts
// main.ts
import { registerComponent } from '@tanzlate/vue';
import UserBadge from '@/components/UserBadge.vue';
import AppButton from '@/components/AppButton.vue';

registerComponent('UserBadge', UserBadge);
registerComponent('AppButton', AppButton);
```

Registered components are resolved automatically — no `:components` prop needed unless you want to pass specific props for that usage. The `:components` prop takes priority over the registry when both are present.

---

## Vanilla JS / framework-agnostic usage

```ts
import { useCoreContext } from '@tanzlate/vanilla';
import type { Createi18nConfigParams } from '@tanzlate/vanilla';

const config: Createi18nConfigParams = {
  fallbackLng: 'en',
  lng: 'en',
  supportedLanguages: ['en', 'de'],
  namespace: 'app',
  resources: { en: { app: { hello: 'Hello world' } } },
};

const ctx = await useCoreContext({ config });
const t = ctx.composeHelper('app');

console.log(t('hello')); // → "Hello world"
```

---

## Contributing

Issues and pull requests are welcome. Please open an issue before submitting large changes.

---

## License

[MIT](./LICENSE) © Arthur Plazanet
