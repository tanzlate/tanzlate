import { CoreContext } from '@tanzlate/step';
import { InjectionKey, Ref } from 'vue';

export interface I18nContext {
  ctx: CoreContext;
  langRef: Ref<string>;
}

export const i18nKey = Symbol() as InjectionKey<I18nContext>;
