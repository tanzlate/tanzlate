[@tanzlate/root](../../../index.md) / [vanilla/src](../index.md) / Createi18nConfigParams

# Type Alias: Createi18nConfigParams

```ts
type Createi18nConfigParams = Omit<InitOptions, 'backend' | 'resources'> & object;
```

Defined in: [packages/vanilla/src/types/config.ts:10](https://github.com/use-compose/i18next-compose/blob/f86f10e367e21d64723c32e51f3dcc439e7b8d66/packages/vanilla/src/types/config.ts#L10)

i18n configuration parameters
It extends i18next InitOptions but omits some properties to allow custom naming and typing.

## Type declaration

### backend?

```ts
optional backend: FsBackendOptions;
```

Optional: constrain backend to the FS backend options

### namespace?

```ts
optional namespace: string | readonly string[] | InitOptions["ns"];
```

Your alias for i18next's `ns`

### resources?

```ts
optional resources: Resource;
```

Keep a precise type for resources

### supportedLanguages?

```ts
optional supportedLanguages: InitOptions["supportedLngs"];
```

Your alias for i18next's `supportedLngs`
