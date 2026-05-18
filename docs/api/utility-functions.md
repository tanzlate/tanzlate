---
outline: [2, 3]
order: 0
---

# Utility Functions

## useCoreContext

Initializes i18next and returns a `CoreContext`. When `ssr` is `true` or no config is provided, returns a safe no-op stub (useful for server-side rendering).

```ts
async function useCoreContext({ config, ssr }: CoreContextParams): Promise<CoreContext>;
```

### Parameters

```ts
interface CoreContextParams {
  config: Createi18nConfigParams;
  ssr?: boolean;
}

interface Createi18nConfigParams {
  namespace?: string;
  fallbackLng: string;
  preload?: string[];
  lng: string;
  supportedLanguages?: string[];
  resources?: Resource;
  debug?: boolean;
  initImmediate?: boolean;
}
```

- `config.namespace`: The namespace to use for the i18next configuration.
- `config.fallbackLng`: The fallback language to use if the translation is not available in the current language.
- `config.lng`: The current language.
- `config.supportedLanguages`: An array of supported languages.
- `config.resources`: An optional object containing the resources for the i18next configuration.
- `ssr`: When `true`, returns a stub context (useful for server-side rendering).

```ts
import { useCoreContext } from '@tanzlate/vanilla';
import type { Createi18nConfigParams } from '@tanzlate/vanilla';

const ctx = await useCoreContext({
  config: {
    namespace: 'my_namespace',
    fallbackLng: 'en',
    lng: 'en',
    supportedLanguages: ['en', 'fr', 'de'],
  },
});

const t = ctx.composeHelper('my_namespace');
console.log(t('hello')); // → "Hello"
```

## i18nFormatterHelper

Returns translation helper functions for a given i18next instance.

```ts
function i18nFormatterHelper(i18nApp: I18nApp): I18nFormatterHelper;
```

## getFlagEmoji

Converts an ISO country code to an emoji flag.
From [Grafikart](https://grafikart.fr/tutoriels/drapeau-emoji-fonction-2152).

```ts
function getFlagEmoji(countryCode: string): string;
```

### Example

```ts
const frFlag = getFlagEmoji('fr'); // 🇫🇷
const enFlag = getFlagEmoji('gb'); // 🇬🇧
const deFlag = getFlagEmoji('de'); // 🇩🇪
```
