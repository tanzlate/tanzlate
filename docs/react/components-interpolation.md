---
title: Translation Interpolation
titleTemplate: tanzlate
description: Using the Trans component to render complex translations with components and values.
outline: [2, 3]
---

# Components Interpolation

Support for rendering React components and HTML tags with custom props inside translation strings, with a focus on human-readable strings.

## Using a single component to interpolate complex translations

The `<Trans>` component accepts:

- The current translation function (`cT` from `useI18n`) in a given context
- The translation key
- Optional interpolation values
- The list of components to interpolate, as an object where props are passed inline

```tsx
<Trans
  t={cT}
  i18nKey="interpolate_with_complex_translation"
  components={{
    Link: { to: toCourseList },
    SelfClosingComponent: { prop1: 'prop1', prop2: 'prop2' },
    'Link-2': { to: 'blablabla' },
  }}
/>
```

## Parsing translation strings

Starting from this translation:
`Hallo und <Link>Wilkommen zurück</Link>! Viel Spaß <Link-2>mit unserer <SelfClosingComponent />App</Link-2>`

The parser produces:

```ts
[
  'Hallo und ',
  {
    tag: 'Link',
    content: 'Wilkommen zurück',
  },
  '! Viel Spaß ',
  {
    tag: 'Link-2',
    content: 'mit unserer <SelfClosingComponent />App',
  },
];
```

### AST output

For the key:

```json
"Wunderbar! <Link>The customer <strong>{{ customer.name }}</strong></Link> hat den <Link-2>Kurs</Link-2> erfolgreich absolviert."
```

The parser returns:

```ts
[
  'Wunderbar! ',
  {
    tag: 'Link',
    content: [
      'The customer ',
      {
        tag: 'strong',
        content: 'Arthur',
      },
    ],
  },
  ' hat den ',
  {
    tag: 'Link-2',
    content: 'Kurs',
  },
  ' erfolgreich absolviert.',
];
```
