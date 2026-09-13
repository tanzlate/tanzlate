---
outline: [2, 3]
order: 3
title: Component Registry
slug: /component-registry
---

# Component Registry

The registry lets you register Vue components or native HTML tags by name so they can be used inside your interpolated translations.

Registration is **required** for PascalCase components: the `:components` prop passes props to a tag, but only the registry resolves the tag to an actual component. Lowercase HTML tags render without registration.

For example, given this translation:

```json
{
  "home": {
    "example": "See <ColoredLabel-1>details</ColoredLabel-1> and <Icon />."
  }
}
```

The `<Tanzlate>` component will look up `<ColoredLabel-1>` and `<Icon />` in the registry.

## Basic Usage

1. Import the registry functions

```ts
import { registerComponent } from '@tanzlate/vue';
```

2. Register your components or HTML tags

```ts
import ColoredLabel from '@/components/ColoredLabel.vue';

registerComponent('em', 'em'); // native HTML
registerComponent('ColoredLabel', ColoredLabel); // Vue SFC
registerComponent('NuxtLink', () => import('@/components/NuxtLink.vue')); // async
registerComponent('Icon', { template: '<svg>...</svg>' }); // inline component
```

3. Use them in your translations

```json
{
  "home": {
    "example": "Hello <em>world</em> and <ColoredLabel />!"
  }
}
```

Your `<Tanzlate>` component will render the `<em>` as HTML and `<ColoredLabel />` as the Vue component.
