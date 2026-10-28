# @tanzlate/vue

[![npm](https://img.shields.io/npm/v/@tanzlate/vue?color=519ea9)](https://www.npmjs.com/package/@tanzlate/vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/tanzlate/tanzlate/blob/main/LICENSE)

i18n for Vue 3 and Nuxt, built on [i18next](https://www.i18next.com/) — with real components
interpolated **inside** translation strings.

```json
{ "welcome": "Hello <UserBadge />, <AppLink>your tour</AppLink> is ready." }
```

That whole sentence stays in one key. Translators see the full context; you don't split it across
template slots.

## Install

```bash
npm install @tanzlate/vue
```

`@tanzlate/core` and `@tanzlate/vanilla` come with it. `vue` (`^3.5.0`) is a peer dependency.

## Quick start

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
import type { Createi18nConfigParams } from '@tanzlate/vanilla';
import { I18nProvider } from '@tanzlate/vue';
import EN from './locales/en.json';

const i18nConfig: Createi18nConfigParams = {
  namespace: 'app',
  lng: 'en',
  supportedLanguages: ['en', 'de'],
  resources: { en: EN },
};
</script>
```

```vue
<template>
  <h1>{{ tanz('title') }}</h1>
  <Tanzlate :t-z="tanz" i18n-key="welcome" :components="{ AppLink: { href: '/tour' } }" />
</template>

<script setup lang="ts">
import { Tanzlate, useI18n } from '@tanzlate/vue';

const { tanz } = useI18n('home');
</script>
```

Register any PascalCase component once, then pass only its props per usage:

```ts
import { registerComponent } from '@tanzlate/vue';
registerComponent('UserBadge', UserBadge);
```

Lowercase HTML tags (`<a>`, `<b>`, `<strong>`) need no registration. Use `UserBadge-1`, `-2`… to
place the same component several times in one string with different props.

`tanz()` returns a plain string — any value containing tags has to go through `<Tanzlate>`.

## Exports

| Export              | What it is                                                           |
| ------------------- | -------------------------------------------------------------------- |
| `I18nProvider`      | Provides the i18n context. Takes `i18next-config` or `i18n-context`. |
| `useI18n(ns)`       | `{ tanz, globalT, lang, changeLanguage, i18nApp }` scoped to `ns`.   |
| `<Tanzlate>`        | Renders a translation whose value contains tags.                     |
| `registerComponent` | Maps a tag name to a component, app-wide.                            |

## Documentation

[Getting started](https://github.com/tanzlate/tanzlate/blob/main/docs/guide/getting-started.md) ·
[Vue API](https://github.com/tanzlate/tanzlate/blob/main/docs/vue/api.md) ·
[Component interpolation](https://github.com/tanzlate/tanzlate/blob/main/docs/vue/components-interpolation.md)

MIT © Arthur Plazanet
