---
'@tanzlate/vue': minor
---

`I18nProvider` no longer needs an outer `<Suspense>` when you pass `i18n-context`

`setup` was unconditionally `async`, which forced every consumer to supply a `<Suspense>` boundary
even when passing an already-resolved context, where nothing is awaited. It now returns a promise
only on the `i18next-config` branch that actually awaits:

```vue
<!-- still needs the boundary: the provider initializes i18next itself -->
<Suspense>
  <I18nProvider :i18next-config="config"><App /></I18nProvider>
</Suspense>

<!-- no boundary needed -->
<I18nProvider :i18n-context="ctx"><App /></I18nProvider>
```

`useI18n()` now throws a named error when called with no provider above it, instead of a
`TypeError` from destructuring the result of a non-null-asserted `inject`.

Exports `i18nKey` and the `I18nContext` type so a test can `provide()` a context directly rather
than mounting the whole provider.
