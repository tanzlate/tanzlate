[@tanzlate/root](../../../index.md) / [vue/src](../index.md) / useI18n

# Function: useI18n()

```ts
function useI18n(ns): object;
```

Defined in: [packages/vue/src/composables/context.ts:27](https://github.com/use-compose/i18next-compose/blob/f86f10e367e21d64723c32e51f3dcc439e7b8d66/packages/vue/src/composables/context.ts#L27)

## Parameters

### ns

`string`

## Returns

`object`

### changeLanguage()

```ts
changeLanguage: (lng?) => (Promise<void> = ctx.lang);
```

#### Parameters

##### lng?

`string`

#### Returns

`Promise`\<`void`\>

### globalT

```ts
globalT: TFunc;
```

### i18nApp

```ts
i18nApp: i18n = ctx.i18nApp;
```

### lang

```ts
lang: Ref<string, string>;
```

### tanz

```ts
tanz: TFunc;
```
