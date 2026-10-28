# i18next-compose-vue

## 0.5.0

### Minor Changes

- a4b5e7f: `I18nProvider` no longer needs an outer `<Suspense>` when you pass `i18n-context`

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

### Patch Changes

- Updated dependencies [290b63f]
- Updated dependencies [a4b5e7f]
  - @tanzlate/core@0.3.1
  - @tanzlate/vanilla@0.5.0

## 0.4.0

### Minor Changes

- dadc751: Fix component rendering after a language switch, and warn instead of silently failing on an
  unregistered component
- 0935649: Declare `vue` as a peer dependency instead of a dependency, so consumers no longer risk a second
  Vue copy in their app

### Patch Changes

- dadc751: Fix translation parser corrupting same-name nested tags and quoted attributes containing `>`
- 0eacd0c: Fix a self-closing tag being read as the opening of a later paired tag with the same name
- Updated dependencies [5fd3ede]
  - @tanzlate/vanilla@0.4.1

## 0.3.0

### Minor Changes

- 349e0b0: Update tanzlate

### Patch Changes

- Updated dependencies [349e0b0]
  - @tanzlate/core@0.3.0
  - @tanzlate/vanilla@0.4.0

## 0.2.0

### Minor Changes

- 91fd259: Clean-up and re,ame package / add vanilla bridge instead of 'i18next-compose'"

### Patch Changes

- Updated dependencies [91fd259]
  - @tanzlate/vanilla@0.3.0
  - @tanzlate/core@0.2.0

## 0.1.0

### Minor Changes

- 04d4919: Fix all package .mjs

### Patch Changes

- 9a1e52f: Implement interpolation of Vue Component self-closing tags first working version \n Fix lint and cleanup / document Translate component
- Updated dependencies [9a1e52f]
- Updated dependencies [04d4919]
  - @tanzlate/core@0.2.0

## 0.0.2

### Patch Changes

- Updated dependencies [1c7b665]
  - i18next-compose@0.1.3
