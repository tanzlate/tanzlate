[@tanzlate/root](../../../index.md) / [vanilla/src](../index.md) / useCoreContext

# Function: useCoreContext()

```ts
function useCoreContext(params): Promise<CoreContext>;
```

Defined in: [packages/vanilla/src/context/context.ts:45](https://github.com/use-compose/i18next-compose/blob/f86f10e367e21d64723c32e51f3dcc439e7b8d66/packages/vanilla/src/context/context.ts#L45)

Initializes i18next and returns a [CoreContext](../interfaces/CoreContext.md).
On SSR (`ssr: true`) or when no config is provided, returns the stub context.

## Parameters

### params

[`CoreContextParams`](../interfaces/CoreContextParams.md)

## Returns

`Promise`\<[`CoreContext`](../interfaces/CoreContext.md)\>
