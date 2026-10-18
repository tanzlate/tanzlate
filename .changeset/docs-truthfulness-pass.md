---
'docs': patch
---

Correct the documented API and stop advertising an unpublished package.

The Vue pages documented `<RtTranslate>` with an `rt-translate` prop and a `useI18n` returning
`cT`/`forNamespace` — none of which exist. They now document `<Tanzlate>`, its real props
(`t-z`, `i18n-key`, `values`, `components`, `translation-value`) and the real `useI18n` return
(`tanz`, `globalT`, `lang`, `changeLanguage`, `i18nApp`). The guide's getting-started page was
still the `i18next-compose` page and is now a working Vue/Nuxt quickstart.

React pages are kept as a design sketch but marked clearly as unpublished, and the homepage no
longer offers a React install. Also fixes the GitHub link, drops the VitePress scaffold pages,
and excludes `README`/`CHANGELOG` from the built site.
