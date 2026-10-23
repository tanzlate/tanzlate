---
title: Getting Started
titleTemplate: tanzlate
description: Install @tanzlate/vue and render your first translation with component interpolation.
outline: [2, 3]
order: 1
---

# Getting Started

![NPM Package Version](https://img.shields.io/npm/v/@tanzlate/vue?color=519ea9)

This page gets a Vue 3 or Nuxt app rendering a translation string that contains real components.
For the reasoning behind the library, see [Motivation](/motivation).

## Installation

::: code-group

```bash [npm]
npm install @tanzlate/vue
```

```bash [yarn]
yarn add @tanzlate/vue
```

```bash [pnpm]
pnpm add @tanzlate/vue
```

:::

`@tanzlate/vue` pulls in `@tanzlate/vanilla` and `@tanzlate/core` itself — you don't install those
separately. `vue` is a peer dependency (`^3.5.0`), so your app's copy is the one that gets used.

Without a framework, install [`@tanzlate/vanilla`](/vanilla/) on its own.

## 1. Translation resources

Keys are nested **namespace → context → key**. The namespace is set once in the config, the context
is what you pass to `useI18n()`:

```json
// locales/en.json
{
  "app_namespace": {
    "home": {
      "welcome": "Welcome to tanzlate with <LangSwitcher>switch language</LangSwitcher>",
      "description": "A simple <b>example</b> of tanzlate in a Nuxt app"
    }
  }
}
```

## 2. Wrap the app in `I18nProvider`

```vue
<!-- app.vue -->
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
  namespace: 'app_namespace',
  lng: 'en',
  fallbackLng: 'en',
  supportedLanguages: ['en', 'de'],
  resources: {
    en: EN_TRANSLATION,
    de: DE_TRANSLATION,
  },
};
</script>
```

::: warning `I18nProvider` needs an outer `<Suspense>` here
Given `i18next-config`, it awaits the i18next init, so the **parent** has to provide a `<Suspense>`
boundary. (If you build the context yourself and pass `i18n-context` instead, it stays synchronous
and needs no boundary.) It also renders a `<div class="i18n-provider">` around your children, which
can matter for layout.
:::

## 3. Translate

`useI18n(context)` returns `tanz`, the translation function for that context.

```vue
<template>
  <!-- plain string, no tags -->
  <h1>{{ tanz('welcome') }}</h1>

  <!-- tags in the string become real components -->
  <Tanzlate :t-z="tanz" i18n-key="description" />
</template>

<script setup lang="ts">
import { Tanzlate, useI18n } from '@tanzlate/vue';

const { tanz } = useI18n('home');
</script>
```

::: tip `tanz()` vs `<Tanzlate>`
`tanz()` returns a **plain string**. If the value contains tags, <code v-pre>{{ tanz('description') }}</code>
prints them literally as text — that is correct behavior, not a bug. Any key whose value contains tags has
to go through `<Tanzlate>`, which parses the string and builds the nodes.
:::

## 4. Interpolate components

Register a PascalCase component once, then pass only its props per usage:

```ts
import { registerComponent } from '@tanzlate/vue';
import ColoredLabel from '~/components/ColoredLabel.vue';

registerComponent('ColoredLabel', ColoredLabel);
```

```vue
<Tanzlate
  :t-z="tanz"
  i18n-key="componentInterpolationExample"
  :components="{
    ColoredLabel: { color: '#3178c6', label: 'Blue Label' },
    'ColoredLabel-1': { color: labelColor, label: 'Red Label' },
    a: { href: 'https://tanzlate.dev' },
  }"
/>
```

Three things are happening there, and they are the heart of the library:

- `registerComponent` resolves the tag — **once per app**, covering every string that uses it.
- `:components` supplies **props only**, per usage. It never resolves a component.
- The `-N` suffix lets one component appear several times in a string with different props.

Lowercase HTML tags (`<a>`, `<b>`, `<strong>`) need no registration.

Full details in [Component Interpolation](/vue/components-interpolation) and
[Component Registry](/vue/component-registry).

## 5. Switch language

```vue
<script setup lang="ts">
import { useI18n } from '@tanzlate/vue';

const { lang, changeLanguage } = useI18n('home');
</script>

<template>
  <button @click="changeLanguage(lang === 'en' ? 'de' : 'en')">
    {{ lang }}
  </button>
</template>
```

`lang` is a `Ref<string>`, and translations re-render on change.

## No global `$t`

tanzlate does not install a global `$t` or `$i18next`. Every component asks for the context it
needs via `useI18n()`, which keeps keys traceable to the component that uses them.
