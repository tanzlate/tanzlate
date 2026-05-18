---
outline: [2, 3]
order: 1
title: Types
---

# Types

## Createi18nConfigParams

Parameters for creating an i18next configuration.

```ts
type Createi18nConfigParams = {
  namespace?: string | readonly string[];
  fallbackLng: string;
  preload?: string[];
  lng: string;
  supportedLanguages?: string[];
  resources?: Resource;
  debug?: boolean;
  initImmediate?: boolean;
  backend?: FsBackendOptions;
};
```

### Properties

- `namespace`: The namespace (maps to i18next `ns`).
- `fallbackLng`: The fallback language when a translation is missing.
- `lng`: The active language.
- `supportedLanguages`: Array of supported languages (maps to i18next `supportedLngs`).
- `resources`: Optional inline resources object.
- `debug`: Enable i18next debug logging.
- `backend`: Optional `i18next-fs-backend` options (Node.js only).

## CoreContext

The context object returned by `useCoreContext`.

```ts
interface CoreContext {
  i18nApp: I18nApp;
  composeHelper: (ns: string) => TFunc;
  lang: (lng?: string) => Promise<void>;
  onLangChange: (callback: (lng: string) => void) => () => void;
}
```

### Properties

- `i18nApp`: The underlying i18next instance.
- `composeHelper`: Returns a scoped translation function for a given namespace.
- `lang`: Change the active language.
- `onLangChange`: Subscribe to language changes. Returns an unsubscribe function.

## TFunc

Translation function returned by `composeHelper`.

```ts
type TFunc = {
  (key: string | InputNamespaces, params?: TOptions): string;
  namespace?: string;
};
```

### Properties

- `key`: The translation key (dot-separated path within the namespace).
- `params`: Optional interpolation parameters.
- `namespace`: The namespace this function is scoped to.

## I18nFormatterHelper

```ts
interface I18nFormatterHelper {
  translationHelper: (ns: string) => TFunc;
}
```
