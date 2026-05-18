[@tanzlate/root](../../index.md) / vanilla/src

# vanilla/src

## Interfaces

| Interface                                                | Description |
| -------------------------------------------------------- | ----------- |
| [CoreContext](interfaces/CoreContext.md)                 | -           |
| [CoreContextParams](interfaces/CoreContextParams.md)     | -           |
| [I18nFormatterHelper](interfaces/I18nFormatterHelper.md) | -           |

## Type Aliases

| Type Alias                                                       | Description                                                                                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [ChangeLanguageFunc](type-aliases/ChangeLanguageFunc.md)         | -                                                                                                                         |
| [Createi18nConfigParams](type-aliases/Createi18nConfigParams.md) | i18n configuration parameters It extends i18next InitOptions but omits some properties to allow custom naming and typing. |
| [InputNamespaces](type-aliases/InputNamespaces.md)               | -                                                                                                                         |
| [TFunc](type-aliases/TFunc.md)                                   | -                                                                                                                         |

## Variables

| Variable                                            | Description |
| --------------------------------------------------- | ----------- |
| [changeLanguage](variables/changeLanguage.md)       | -           |
| [coreContextStub](variables/coreContextStub.md)     | -           |
| [i18nFormatterMock](variables/i18nFormatterMock.md) | -           |

## Functions

| Function                                                | Description                                                                                                                                               |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [contextCoreStub](functions/contextCoreStub.md)         | Creates a stub CoreContext with safe no-op defaults (used for SSR and fallback).                                                                          |
| [getFlagEmoji](functions/getFlagEmoji.md)               | -                                                                                                                                                         |
| [i18nFormatterHelper](functions/i18nFormatterHelper.md) | Provide helper formatter based on current i18next instance to access translations                                                                         |
| [initI18nConfig](functions/initI18nConfig.md)           | Initializes and configures an i18nApp instance which extends i18n to support custom methods and properties.                                               |
| [useCoreContext](functions/useCoreContext.md)           | Initializes i18next and returns a [CoreContext](interfaces/CoreContext.md). On SSR (`ssr: true`) or when no config is provided, returns the stub context. |
