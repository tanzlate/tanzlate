---
title: React (planned)
titleTemplate: tanzlate
description: Design sketch for a future React renderer. Not published.
outline: [2, 3]
---

# React (planned)

::: danger Not published yet
`@tanzlate/react` does **not exist on npm**. This page is a design sketch for a future package, kept
here so the intended API is written down. `npm install @tanzlate/react` will fail.

Only [`@tanzlate/vue`](/vue/) and [`@tanzlate/vanilla`](/vanilla/) are published today.
:::

Intended React integration for tanzlate, including
[components interpolation](/react/components-interpolation).

## Intended API

### `<I18nProvider>`

The `I18nProvider` is a **React context provider** that:

- Initializes an i18next instance with the given config.
- Exposes the i18n context via React's `createContext`/`useContext`.
- Bridges language-change events into React state so components re-render automatically.

```tsx
import { I18nProvider } from '@tanzlate/react';

export default function App() {
  return (
    <I18nProvider config={i18nConfig}>
      <MyApp />
    </I18nProvider>
  );
}
```

### `useI18n`

```ts
import { useI18n } from '@tanzlate/react';

const { tanz, globalT, lang, changeLanguage } = useI18n('home');
```

| Return value     | Type                     | Description                                    |
| ---------------- | ------------------------ | ---------------------------------------------- |
| `tanz`           | `TFunc`                  | Translation helper scoped to the given context |
| `globalT`        | `TFunc`                  | Translation helper for the `global` context    |
| `lang`           | `string`                 | Current language                               |
| `changeLanguage` | `(lng) => Promise<void>` | Change the active language                     |
