---
title: Vue API
titleTemplate: tanzlate
description: Props and behavior of the I18nProvider and RtTranslate components.
outline: [2, 3]
---

# Vue API

## `<RtTranslate>`

| Prop              | Type                       | Description                          |
| ----------------- | -------------------------- | ------------------------------------ |
| `rt-translate`    | `(key, values?) => string` | i18n translate function              |
| `i18n-key`        | `string`                   | Translation key                      |
| `values`          | `Record<string, any>`      | Interpolation values                 |
| `components`      | `Record<string, any>`      | Component map (e.g., `{ NuxtLink }`) |
| `component-props` | `Record<string, any>`      | Props per tag name                   |
| `as`              | `string`                   | Wrapper tag (default `span`)         |

## `<I18nProvider>`

### Props

| Prop            | Type                     | Default          | Description                                   |
| --------------- | ------------------------ | ---------------- | --------------------------------------------- |
| `i18nextConfig` | `Createi18nConfigParams` | built-in default | Custom configuration for the i18next instance |
| `i18nContext`   | `CoreContext`            | —                | Pre-resolved context (skips internal init)    |
