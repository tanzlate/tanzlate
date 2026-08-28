---
title: Component Interpolation
titleTemplate: tanzlate
description: Using the Tanzlate component to render Vue components and HTML tags inside translation strings.
outline: [2, 3]
---

# Component Interpolation

Render Vue components and HTML tags with props inside translation strings — keeping the full sentence in one place for translators and content writers.

## From template to translation string

The starting point is usually a hardcoded template with components inline:

```vue
<template>
  <div>
    Hi {{ name }}! Your <UserBadge :level="user.level" /> is ready.
    <AppButton variant="primary" @click="startTour">Start tour</AppButton>
  </div>
</template>
```

With tanzlate you extract the sentence into a translation string and map the component tags.

::: warning PascalCase components must be registered
`:components` supplies **props for** a tag — it never resolves the component itself. Register
PascalCase components once with [`registerComponent`](#component-registry) or the tag renders as
nothing. Lowercase HTML tags (`<a>`, `<strong>`, `<b>`) work with no registration.

```ts
import { registerComponent } from '@tanzlate/vue';
registerComponent('UserBadge', UserBadge);
registerComponent('AppButton', AppButton);
```

:::

```json
{
  "onboarding": {
    "welcome": "Hi {{ name }}! Your <UserBadge /> is ready. <AppButton>Start tour</AppButton>"
  }
}
```

```vue
<Tanzlate
  :t-z="tanz"
  i18n-key="welcome"
  :values="{ name: user.name }"
  :components="{
    UserBadge: { level: user.level },
    AppButton: { variant: 'primary', onClick: startTour },
  }"
/>
```

Props removed from the template move into the `:components` object. The translation string keeps the full readable sentence.

## HTML tags

Lowercase tags (`<b>`, `<a>`, `<strong>`) are rendered as real HTML elements — no `v-html` and **no registration** needed:

```json
{ "help": "Read the <a>documentation</a> or ask on <strong>Discord</strong>." }
```

```vue
<Tanzlate
  :t-z="tanz"
  i18n-key="help"
  :components="{
    a: { href: 'https://tanzlate.dev', target: '_blank' },
  }"
/>
```

## Using the same component twice

Suffix duplicate tags with `-N` to differentiate them:

```json
{ "links": "Go to <NuxtLink>home</NuxtLink> or <NuxtLink-2>profile</NuxtLink-2>." }
```

```vue
<Tanzlate
  :t-z="tanz"
  i18n-key="links"
  :components="{
    NuxtLink: { to: '/' },
    'NuxtLink-2': { to: '/profile' },
  }"
/>
```

The suffix is stripped before resolving the component — both resolve to `NuxtLink`.

## Nested components

Components can nest — the parser handles it recursively:

```json
{
  "course": "Wunderbar! <NuxtLink>The customer <strong>{{ name }}</strong></NuxtLink> finished the <NuxtLink-2>course</NuxtLink-2>."
}
```

The parser produces this structure before rendering:

```ts
[
  'Wunderbar! ',
  {
    tag: 'NuxtLink',
    content: ['The customer ', { tag: 'strong', content: 'Arthur' }],
  },
  ' finished the ',
  { tag: 'NuxtLink-2', content: 'course' },
  '.',
];
```

## Component registry

For components used across many translation strings, register them once globally instead of passing `:components` on every usage:

```ts
// main.ts
import { registerComponent } from '@tanzlate/vue';
import UserBadge from '@/components/UserBadge.vue';

registerComponent('UserBadge', UserBadge);
```

The two are not alternatives — they do different jobs:

|                     | Resolves the tag to a component | Supplies props |
| ------------------- | ------------------------------- | -------------- |
| `registerComponent` | ✅ required for PascalCase      | —              |
| `:components`       | ❌ never                        | ✅ per usage   |

So a PascalCase tag needs `registerComponent`. `:components` is optional on top, for props that
vary between usages.
