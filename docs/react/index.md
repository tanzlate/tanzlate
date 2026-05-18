---
title: Getting Started (React)
titleTemplate: tanzlate
description: Install and use the React renderer with the Trans component.
outline: [2, 3]
---

# React Integration

![NPM Package Version](https://img.shields.io/npm/v/@tanzlate/react?color=519ea9)

React integration for tanzlate, including [components interpolation](/react/components-interpolation).

## Installation

::: code-group

```bash [npm]
npm install @tanzlate/react
```

```bash [yarn]
yarn add @tanzlate/react
```

```bash [pnpm]
pnpm add @tanzlate/react
```

:::

## Usage

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

const { cT, globalT, forNamespace, lang, changeLanguage } = useI18n('my_namespace');
```

| Return value     | Type                     | Description                                      |
| ---------------- | ------------------------ | ------------------------------------------------ |
| `cT`             | `cTFunc`                 | Translation helper scoped to the given namespace |
| `globalT`        | `cTFunc`                 | Translation helper for the global namespace      |
| `forNamespace`   | `(ns) => cTFunc`         | Factory to create a helper for any namespace     |
| `lang`           | `string`                 | Current language                                 |
| `changeLanguage` | `(lng) => Promise<void>` | Change the active language                       |
