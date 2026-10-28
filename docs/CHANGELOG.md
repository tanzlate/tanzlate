# docs

## 1.0.2

### Patch Changes

- 9f3c13b: Correct the documented API and stop advertising an unpublished package.

  The Vue pages documented `<RtTranslate>` with an `rt-translate` prop and a `useI18n` returning
  `cT`/`forNamespace` — none of which exist. They now document `<Tanzlate>`, its real props
  (`t-z`, `i18n-key`, `values`, `components`, `translation-value`) and the real `useI18n` return
  (`tanz`, `globalT`, `lang`, `changeLanguage`, `i18nApp`). The guide's getting-started page was
  still the `i18next-compose` page and is now a working Vue/Nuxt quickstart.

  Documents two traps reported in #144 and #145: `useCoreContext`'s `ssr` option defaults to
  `typeof window === 'undefined'`, so it silently returns a no-op stub in any Node process unless
  you pass `ssr: false`; and a missing key resolves to the prefixed lookup key, not an empty string.
  Adds `@tanzlate/core` + a self-created i18next instance as the documented path for backends and
  concurrent per-request locales.

  React pages are kept as a design sketch but marked clearly as unpublished, and the homepage no
  longer offers a React install. Also fixes the GitHub link, drops the VitePress scaffold pages,
  and excludes `README`/`CHANGELOG` from the built site.

## 1.0.1

### Patch Changes

- 20d42bb: Quick advancement docs
