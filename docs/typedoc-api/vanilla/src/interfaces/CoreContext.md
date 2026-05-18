[@tanzlate/root](../../../index.md) / [vanilla/src](../index.md) / CoreContext

# Interface: CoreContext

Defined in: [packages/vanilla/src/context/context.ts:10](https://github.com/use-compose/i18next-compose/blob/f86f10e367e21d64723c32e51f3dcc439e7b8d66/packages/vanilla/src/context/context.ts#L10)

## Properties

### i18nApp

```ts
i18nApp: i18n;
```

Defined in: [packages/vanilla/src/context/context.ts:11](https://github.com/use-compose/i18next-compose/blob/f86f10e367e21d64723c32e51f3dcc439e7b8d66/packages/vanilla/src/context/context.ts#L11)

---

### lang()

```ts
lang: (lng?) => Promise<void>;
```

Defined in: [packages/vanilla/src/context/context.ts:13](https://github.com/use-compose/i18next-compose/blob/f86f10e367e21d64723c32e51f3dcc439e7b8d66/packages/vanilla/src/context/context.ts#L13)

#### Parameters

##### lng?

`string`

#### Returns

`Promise`\<`void`\>

---

### onLangChange()

```ts
onLangChange: (callback) => () => void;
```

Defined in: [packages/vanilla/src/context/context.ts:14](https://github.com/use-compose/i18next-compose/blob/f86f10e367e21d64723c32e51f3dcc439e7b8d66/packages/vanilla/src/context/context.ts#L14)

#### Parameters

##### callback

(`lng`) => `void`

#### Returns

```ts
(): void;
```

##### Returns

`void`

## Methods

### composeHelper()

```ts
composeHelper(level2): TFunc;
```

Defined in: [packages/vanilla/src/context/context.ts:12](https://github.com/use-compose/i18next-compose/blob/f86f10e367e21d64723c32e51f3dcc439e7b8d66/packages/vanilla/src/context/context.ts#L12)

#### Parameters

##### level2

`string`

#### Returns

[`TFunc`](../type-aliases/TFunc.md)
