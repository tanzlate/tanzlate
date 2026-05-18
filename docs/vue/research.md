---
title: Research
titleTemplate: i18next-compose-vue
description: Research and exploration of translation strategies and best practices.
outline: [2, 3]
---

# Research

Research and exploration of translation strategies for the i18next-compose project.

# Inspiration from existing libraries

### 1. Component interpolation from [vue-i18next](https://panter.github.io/vue-i18next/guide/component-interpolation.html) and [i18next-vue](https://i18next.github.io/i18next-vue/guide/component-interpolation.html#component-interpolation)([GitHub])(https://github.com/i18next/i18next-http-backend/blob/master/example/vue/src/vue-i18next.js))

Especially the first one looked promising looking at this issue https://github.com/i18next/i18next-vue/issues/8 as it seemed more dynamic.

But as you can see, they are both using a `<i18next>` component to interpolate Vue components and/or HTML tags directly and then some specific template or slots are needed, which is not super practical.

Then I went to the React side...

### 2. [Trans component from react-i18next](https://react.i18next.com/latest/trans-component#alternative-usage-which-lists-the-components-v11.6.0) or libs like [React HTML Parser](https://github.com/peternewnham/react-html-parser#readme)

Which initially looks a bit more like what I wanted

But as seen [here](https://github.com/i18next/react-i18next/blob/7e2c55b3931f0b65ca6287b2f3bd8c1dd0fe1798/src/TransWithoutContext.js#L2C19-L2C39) or [here](https://github.com/peternewnham/react-html-parser/blob/e89bba4f8022a92418186cfaacfd473e81e31d92/src/HtmlParser.js#L1) they are mostly using pure HTML parser libraries in the first place, which is what I wanted to do in the first place (using DOMParser https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)

Also find this library https://github.com/henrikjoreteg/html-parse-stringify?tab=readme-ov-file#what-does-the-ast-look-like which is the result form I kind of liked and wanted to have 😄

---

# Solution proposal

After multiple tries I finally chose to not use any DOMParser to parse the string translation, as it could lead to too much complexity with Vue component (as HTML tags are lowercase, `tagName` is [uppercase](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName) and parsing through each tags could lead to some uncertainty)

Here's what I propose:

## 1. Using a function to detect the presence of Vue components (or not) inside the translation

I implemented a method which uses a custom Regex [to recognize any component present inside the translation value](https://github.com/reteach/reteach-app/pull/3092/files#diff-b05b85a934d3b39d1eda21a661ac9eaead2d1b26f72a99176c0fb323c3847715R102-R109). It works for for opening, closing, self-closing and snake-case tags (in case of an external library for example)

It will return `null` or and array or component tags such as

```javascript
["<NuxtLink>","</NuxtLink>"]`
```

## 2. Using a parsing function to correctly render the translation value based on the eixstence of Vue components

Starting from this translation
`Hallo und <NuxtLink>Wilkommen zurück</NuxtLink>! Viel Spaß <NuxtLink-2>mit unserer <SelfClosingComponent />App</NuxtLink-2><library-component> sie uns </library-component/> wissen`

The idea is to get something as such:

```javascript
[
  'Hallo und ',
  {
    tag: 'NuxtLink',
    content: 'Wilkommen zurück',
  },
  '! Viel Spaß ',
  {
    tag: 'NuxtLink-2',
    // this would need to be recursively parsed
    content: 'mit unserer <SelfClosingComponent />App',
  },
];
```

To make it easier to work with afterwards

## 3. Using a single component to interpolate and handle complex translation values containing Vue components

This component would accept the following props:

- The current translations functions (`rtTranslate` or `rtGlobalT`for example) in a given context
- The translation key
- The potential params/values inside the translations
- The list of components to interpolate, as an object where we will pass the props - as they could be dynamic, they won't be part of the translation string

```vue
<RtTranslate
  :rt-translate="rtTranslate"
  i18n-key="interpolate_with_complex_translation"
  :components="{
    NuxtLink: { to: toCourseList },
    SelfClosingComponent: { prop1: 'prop1', prop2: 'prop2' },
    'NuxtLink-2': { to: 'blablabla' },
  }"
/>
```

By specifying `NuxtLink` through different names (`NuxtLink` and `NuxtLink-2`) we ensure to not overlap any existing properties.
