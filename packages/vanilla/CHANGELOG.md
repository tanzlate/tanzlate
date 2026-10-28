# core

## 0.5.0

### Minor Changes

- a4b5e7f: Stop importing `i18next-fs-backend`, so Node's `fs` no longer reaches browser bundles

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

### Patch Changes

- Updated dependencies [290b63f]
  - @tanzlate/core@0.3.1

## 0.4.1

### Patch Changes

- 5fd3ede: Let a caller's `interpolation` options reach i18next

## 0.4.0

### Minor Changes

- 349e0b0: Update tanzlate

### Patch Changes

- Updated dependencies [349e0b0]
  - @tanzlate/core@0.3.0

## 0.3.0

### Minor Changes

- 91fd259: Clean-up and re,ame package / add vanilla bridge instead of 'i18next-compose'"

### Patch Changes

- Updated dependencies [91fd259]
  - @tanzlate/core@0.2.0

## 0.2.0

### Minor Changes

- 04d4919: Fix all package .mjs

### Patch Changes

- 9a1e52f: Implement interpolation of Vue Component self-closing tags first working version \n Fix lint and cleanup / document Translate component

## 0.1.4

### Patch Changes

- 1c7b665: More conventions on typings

## 0.1.3

### Patch Changes

- 706a3d8: Create context from core and expose basic useI18n
- 706a3d8: Create context typing fixes

## 0.1.2

### Patch Changes

- dccb1b0: Change language basic support + tests

## 0.1.1

### Patch Changes

- 9de1916: Fix config fs-backend, formatter types and improved tests

## 0.1.0

### Minor Changes

- bf0544b: First minor iteration POC

## 0.0.4

### Patch Changes

- 20d42bb: Support backend fs option config

## 0.0.3

### Patch Changes

- 88b3b0b: Initial patch

## 0.0.1

### Patch Changes

- Initial
