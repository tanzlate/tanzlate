import { Namespace, TOptions } from 'i18next';
export type { I18nFormatterHelper, InputNamespaces, TFunc };

type InputNamespaces = Namespace | Namespace[];

interface I18nFormatterHelper {
  translationHelper: (level2: Namespace) => TFunc;
}

type TFunc = { (ns: InputNamespaces, params?: TOptions): string; namespace?: Namespace };
