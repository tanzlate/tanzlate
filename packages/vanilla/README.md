# @tanzlate/vanilla

[![npm](https://img.shields.io/npm/v/@tanzlate/vanilla?color=519ea9)](https://www.npmjs.com/package/@tanzlate/vanilla)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/tanzlate/tanzlate/blob/main/LICENSE)

The framework-agnostic [i18next](https://www.i18next.com/) runtime behind
[tanzlate](https://github.com/tanzlate/tanzlate) — config, instance creation and namespace-scoped
translation helpers, with no framework attached.

**Using Vue 3 or Nuxt? Install [`@tanzlate/vue`](https://www.npmjs.com/package/@tanzlate/vue)
instead** — it depends on this package and adds component interpolation.

## Install

```bash
npm install @tanzlate/vanilla
```

## Usage

```ts
import { useCoreContext } from '@tanzlate/vanilla';
import EN from './locales/en.json';

const ctx = await useCoreContext({
  config: {
    namespace: 'app',
    lng: 'en',
    supportedLanguages: ['en', 'de'],
    resources: { en: EN },
  },
  ssr: false,
});

const t = ctx.composeHelper('home');
t('welcome'); // → "Welcome"

await ctx.lang('de');
```

## Backends

No backend is bundled — pass your own module so nothing you don't use ends up in your bundle:

```ts
import FsBackend from 'i18next-fs-backend';

await useCoreContext({
  config: {
    modules: [FsBackend],
    backend: { loadPath: './locales/{{lng}}/{{ns}}.json' },
  },
  ssr: true,
});
```

`modules` is passed to i18next's `use()` before `init`; `backend` is forwarded untouched, so any
backend's own options work.

## Documentation

[Vanilla guide](https://github.com/tanzlate/tanzlate/blob/main/docs/vanilla/index.md) ·
[Config types](https://github.com/tanzlate/tanzlate/blob/main/docs/api/types.md)

MIT © Arthur Plazanet
