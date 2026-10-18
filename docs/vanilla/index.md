---
title: Vanilla JS Overview
titleTemplate: tanzlate
description: Overview of @tanzlate/vanilla — the i18next runtime and namespace helpers, without framework bindings.
outline: [2, 3]
sidebarDepth: 2
---

# tanzlate (Vanilla JS)

![NPM Package Version](https://img.shields.io/npm/v/@tanzlate/vanilla?color=519ea9)

`@tanzlate/vanilla` is the framework-agnostic layer: it initializes i18next and exposes the
namespace-scoped translation helpers. Component interpolation lives in the framework packages —
the parser is in [`@tanzlate/vue`](/vue/), not here.

| Package             | What it holds                                                 |
| ------------------- | ------------------------------------------------------------- |
| `@tanzlate/core`    | Formatter types and `translation-helpers`. No i18next runtime |
| `@tanzlate/vanilla` | i18next runtime: `useCoreContext`, `initI18nConfig`           |
| `@tanzlate/vue`     | Vue layer: `I18nProvider`, `useI18n`, `<Tanzlate>`, registry  |

You install the layer you need — `@tanzlate/vue` brings the other two with it.

## Installation

::: code-group

```bash [npm]
npm install @tanzlate/vanilla
```

```bash [yarn]
yarn add @tanzlate/vanilla
```

```bash [pnpm]
pnpm add @tanzlate/vanilla
```

:::

## Usage

```ts
import { useCoreContext } from '@tanzlate/vanilla';

const ctx = await useCoreContext({
  config: {
    namespace: 'app_namespace',
    lng: 'en',
    fallbackLng: 'en',
    supportedLanguages: ['en', 'de'],
    resources: { en: EN_TRANSLATION, de: DE_TRANSLATION },
  },
});

const tanz = ctx.composeHelper('home');

tanz('welcome'); // → "Welcome to tanzlate"
await ctx.lang('de');
```

`useCoreContext` returns a stub context when `ssr` is true (the default when there is no `window`),
so it is safe to call during server rendering.

| Member          | Type                              | Description                       |
| --------------- | --------------------------------- | --------------------------------- |
| `i18nApp`       | `i18n`                            | The i18next instance              |
| `composeHelper` | `(context: string) => TFunc`      | Translation helper for a context  |
| `lang`          | `(lng?: string) => Promise<void>` | Change language                   |
| `onLangChange`  | `(cb) => () => void`              | Subscribe; returns an unsubscribe |

See [Utility Functions](/api/utility-functions) and [Types](/api/types).
