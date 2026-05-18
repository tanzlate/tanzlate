---
title: Getting Started (Vue)
titleTemplate: tanzlate
description: Install and use the Vue renderer with the RtTranslate component.
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

## Usage

### `<I18nProvider>`

The `I18nProvider` is a **Vue wrapper component** that:

- Initializes an i18next instance with the given config.
- Exposes the i18n context via Vue's `provide`/`inject`.
- Wraps your app (or part of it) in a `Suspense` boundary, ensuring translations are ready before render.

---

```vue
<script setup lang="ts">
import I18nProvider from '@tanzlate/vue';
import RtTranslate from '@tanzlate/vue';
</script>

<template>
  <I18nProvider :i18next-config="config">
    <div>
      <RtTranslate i18n-key="home.welcome" :components="components" />
    </div>
  </I18nProvider>
</template>
```

#### Provided Context

Internally, `I18nProvider`:

- Calls `useCoreContext()` from `@tanzlate/core` to initialize the i18next instance.
- Provides the reactive context (language ref + helpers) to all child components via `provide`.

This makes reactive translation helpers available to child components via `useI18n()`.

#### Render Behavior

The provider wraps children in a `<Suspense>` block, ensuring translations are fully initialized before any child renders.

### `useI18n`

```ts
import { useI18n } from '@tanzlate/vue';

const { cT, globalT, forNamespace, lang, changeLanguage } = useI18n('my_namespace');
```

| Return value     | Type                     | Description                                      |
| ---------------- | ------------------------ | ------------------------------------------------ |
| `cT`             | `cTFunc`                 | Translation helper scoped to the given namespace |
| `globalT`        | `cTFunc`                 | Translation helper for the global namespace      |
| `forNamespace`   | `(ns) => cTFunc`         | Factory to create a helper for any namespace     |
| `lang`           | `Ref<string>`            | Reactive current language                        |
| `changeLanguage` | `(lng) => Promise<void>` | Change the active language                       |
