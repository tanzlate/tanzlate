---
'@tanzlate/vanilla': minor
---

Stop importing `i18next-fs-backend`, so Node's `fs` no longer reaches browser bundles

`initI18nConfig` called `await import('i18next-fs-backend')` behind an `if (backend)` guard. The
guard is a runtime check, but bundlers follow a dynamic import regardless of the condition around
it, so every SPA build carried the Node-only backend whether or not it was used.

Backends are now supplied by the caller through a new `modules` option, and
`i18next-fs-backend` is no longer a dependency of this package at all:

```ts
// before
await initI18nConfig({ backend: { loadPath: './locales/{{lng}}.json' } });

// after
import FsBackend from 'i18next-fs-backend';
await initI18nConfig({
  modules: [FsBackend],
  backend: { loadPath: './locales/{{lng}}.json' },
});
```

Passing `backend` without a module now throws instead of silently failing to load anything.

`backend` is no longer typed as `FsBackendOptions` — it is passed through to i18next untouched, so
an HTTP or custom backend's own options work too. The previous code copied six known fields and
dropped everything else; that is fixed as a side effect.

Also removes the `@use-compose/logger` calls, which did an unconditional `console.log` on every
language change in production, and the dead `missingTranslationHandler` that was their only other
caller.
