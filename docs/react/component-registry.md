---
outline: [2, 3]
order: 3
title: Component Registry (planned)
slug: /component-registry
---

# Component Registry (planned)

::: danger Not published yet
`@tanzlate/react` does **not exist on npm**. This page is a design sketch for a future package, kept
here so the intended API is written down. `npm install @tanzlate/react` will fail.

Only [`@tanzlate/vue`](/vue/) and [`@tanzlate/vanilla`](/vanilla/) are published today.
:::

The registry lets you register React components or native HTML tags by name so they can be used inside your interpolated translations.

For example, given this translation:

```json
{
  "home": {
    "example": "See <ColoredLabel-1>details</ColoredLabel-1> and <Icon />."
  }
}
```

The `<Trans>` component will look up `<ColoredLabel-1>` and `<Icon />` in the registry.

## Basic Usage

1. Import the registry functions

```ts
import { registerComponent } from '@tanzlate/react';
```

2. Register your components or HTML tags

```ts
import ColoredLabel from './components/ColoredLabel';

registerComponent('em', 'em'); // native HTML
registerComponent('ColoredLabel', ColoredLabel); // React component
registerComponent('Icon', () => <svg>...</svg>); // inline component
```

3. Use them in your translations

```json
{
  "home": {
    "example": "Hello <em>world</em> and <ColoredLabel />!"
  }
}
```

Your `<Trans>` component will render the `<em>` as HTML and `<ColoredLabel />` as the React component.
