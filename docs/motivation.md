---
outline: [2, 3]
order: 1
---

# tanzlate

![NPM Package Version](https://img.shields.io/npm/v/@tanzlate/core?color=519ea9)

A lightweight library to manage translations with **component interpolation** and **complex translation strings**.

## Motivation

Translation is rarely just an engineering concern — it often involves multiple teams:

- **Developers** implement the system.
- **Translators** provide the content.
- **Designers** ensure proper rendering.
- **Product Owners/Managers** validate results.
- **Content Writers** refine copy.

tanzlate provides a modular and efficient way to keep everyone aligned, without enforcing global `$t` helpers.

---

Built with a generic **core** package and framework-specific renderers for **Vue** and **React**.

::: tip Why?
Translations often involve developers, translators, designers, and product owners.  
This library keeps everyone aligned by making complex translations easier to manage.
:::

- [Vanilla JS →](/vanilla/)
- [Vue →](/vue/)
- [React →](/react/)

## Installation

::: code-group

```bash [npm]
npm install @tanzlate/core
```

```bash [yarn]
yarn add @tanzlate/core
```

```bash [pnpm]
pnpm add @tanzlate/core
```

:::
