import { CoreContext } from '@tanzlate/vanilla';
import { InjectionKey, Ref } from 'vue';

export interface I18nContext {
  ctx: CoreContext;
  lang: Ref<string>;
}

export const i18nKey = Symbol() as InjectionKey<I18nContext>;
