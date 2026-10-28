---
title: Getting Started (Vue)
titleTemplate: tanzlate
description: Install and use the Vue renderer with the Tanzlate component.
outline: [2, 3]
---

# Vue Integration

![NPM Package Version](https://img.shields.io/npm/v/@tanzlate/vue?color=519ea9)

Vue integration for tanzlate, including [components interpolation](/vue/components-interpolation).

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

`vue` is a peer dependency (`^3.5.0`). `@tanzlate/vanilla` and `@tanzlate/core` come along as
dependencies — no need to install them yourself.

## Usage

### `<I18nProvider>`

The `I18nProvider` is a **Vue wrapper component** that:

- Initializes an i18next instance with the given config.
- Exposes the i18n context via Vue's `provide`/`inject`.
- Bridges i18next's `languageChanged` event into a reactive `lang` ref.

---

```vue
<script setup lang="ts">
import type { Createi18nConfigParams } from '@tanzlate/vanilla';
import { I18nProvider, Tanzlate, useI18n } from '@tanzlate/vue';

const config: Createi18nConfigParams = {
  namespace: 'app_namespace',
  lng: 'en',
  fallbackLng: 'en',
  supportedLanguages: ['en', 'de'],
  resources: { en: EN_TRANSLATION, de: DE_TRANSLATION },
};
</script>

<template>
  <Suspense>
    <I18nProvider :i18next-config="config">
      <HomePage />
    </I18nProvider>
  </Suspense>
</template>
```

Everything is exported **by name** — there is no default export.

#### Provided Context

Internally, `I18nProvider`:

- Calls `useCoreContext()` from `@tanzlate/vanilla` to initialize the i18next instance.
- Provides the reactive context (language ref + helpers) to all child components via `provide`.

This makes reactive translation helpers available to child components via `useI18n()`.

#### Render Behavior

Given `i18next-config`, as above, `setup` returns a promise — it has to await the i18next init —
so **the parent must wrap it in `<Suspense>`**; the provider cannot supply its own boundary. Given a
pre-resolved `i18n-context` it stays synchronous and needs no boundary.

Either way it renders an inner `<Suspense>` plus a wrapper element `<div class="i18n-provider">`
around your children, which is worth knowing when it lands in the middle of a flex or grid
layout.

Either `i18next-config` or `i18n-context` is required; passing neither throws.

### `useI18n`

```ts
import { useI18n } from '@tanzlate/vue';

const { tanz, globalT, lang, changeLanguage, i18nApp } = useI18n('home');
```

The argument is the **context** (the second key level), not the namespace — the namespace is set
once in `Createi18nConfigParams`.

| Return value     | Type                      | Description                                         |
| ---------------- | ------------------------- | --------------------------------------------------- |
| `tanz`           | `TFunc`                   | Translation helper scoped to the given context      |
| `globalT`        | `TFunc`                   | Translation helper for the `global` context         |
| `lang`           | `Ref<string>`             | Reactive current language                           |
| `changeLanguage` | `(lng?) => Promise<void>` | Change the active language                          |
| `i18nApp`        | `i18n`                    | The underlying i18next instance, for escape hatches |

`tanz` returns a **string**. For values containing component tags, pass it to
[`<Tanzlate>`](/vue/api#tanzlate) instead of printing it.
