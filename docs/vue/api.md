---
title: Vue API
titleTemplate: tanzlate
description: Props and behavior of the I18nProvider and Tanzlate components.
outline: [2, 3]
---

# Vue API

## `<Tanzlate>`

```vue
<Tanzlate :t-z="tanz" i18n-key="welcome" :values="{ name }" :components="{ a: { href } }" />
```

| Prop                | Type                             | Required | Description                                            |
| ------------------- | -------------------------------- | -------- | ------------------------------------------------------ |
| `t-z`               | `TFunc`                          | ✅       | Translation function for the current context (`tanz`)  |
| `i18n-key`          | `string`                         | ✅       | Translation key, relative to the context               |
| `values`            | `TOptions`                       | —        | Interpolation values passed through to i18next         |
| `components`        | `Record<string, object \| null>` | —        | **Props per tag name.** Does not resolve components    |
| `translation-value` | `string`                         | —        | Parse this string directly instead of looking up a key |

`:components` keys are tag names as they appear in the translation string, including any `-N`
suffix (`'NuxtLink-2'`). Values are plain prop objects — in Vue 3 props, attributes and `onClick`
style listeners all go in the same object.

There is no `as` or wrapper prop: `<Tanzlate>` renders a fragment, so it can have several root
nodes and inherits no wrapper element.

PascalCase tags must be resolved through [`registerComponent`](/vue/component-registry). An
unregistered tag renders its text content and logs one warning naming the tag.

`translation-value` exists mainly for tests and edge cases — it bypasses the key lookup, and
language changes do not re-trigger it the way a key does.

## `<I18nProvider>`

Requires an outer `<Suspense>` (its `setup` is `async`) and renders a
`<div class="i18n-provider">` around its children.

### Props

| Prop            | Type                     | Default | Description                                |
| --------------- | ------------------------ | ------- | ------------------------------------------ |
| `i18nextConfig` | `Createi18nConfigParams` | —       | Configuration for the i18next instance     |
| `i18nContext`   | `CoreContext`            | —       | Pre-resolved context (skips internal init) |

One of the two is required — passing neither throws
`[tanzlate] I18nProvider requires either i18next-config or i18n-context.`

## `registerComponent`

```ts
registerComponent(name: string, component: Component | string | AsyncComponentLoader): void
```

See [Component Registry](/vue/component-registry).

## `useI18n`

```ts
useI18n(context: string): { tanz, globalT, lang, changeLanguage, i18nApp }
```

See [Getting Started (Vue)](/vue/#usei18n).
