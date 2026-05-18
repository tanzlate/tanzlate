[@tanzlate/root](../../../index.md) / [vue/src](../index.md) / Tanzlate

# Variable: Tanzlate

```ts
Tanzlate: DefineComponent<
  ExtractPropTypes<{
    components: {
      default: () => object;
      type: PropType<ComponentsProps>;
    };
    i18nKey: {
      required: true;
      type: StringConstructor;
    };
    translationValue: {
      required: false;
      type: StringConstructor;
    };
    tZ: {
      required: true;
      type: PropType<TFunc>;
    };
    values: {
      required: false;
      type: PropType<TOptions>;
    };
  }>,
  () =>
    | string
    | (
        | string
        | VNode<
            RendererNode,
            RendererElement,
            {
              [key: string]: any;
            }
          >
      )[],
  {},
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  {},
  string,
  PublicProps,
  ToResolvedProps<
    ExtractPropTypes<{
      components: {
        default: () => object;
        type: PropType<ComponentsProps>;
      };
      i18nKey: {
        required: true;
        type: StringConstructor;
      };
      translationValue: {
        required: false;
        type: StringConstructor;
      };
      tZ: {
        required: true;
        type: PropType<TFunc>;
      };
      values: {
        required: false;
        type: PropType<TOptions>;
      };
    }>,
    {}
  >,
  {
    components: ComponentsProps;
  },
  {},
  {},
  {},
  string,
  ComponentProvideOptions,
  true,
  {},
  any
>;
```

Defined in: [packages/vue/src/components/translate/Tanzlate.ts:29](https://github.com/use-compose/i18next-compose/blob/f86f10e367e21d64723c32e51f3dcc439e7b8d66/packages/vue/src/components/translate/Tanzlate.ts#L29)
