import { InputNamespaces, TFunc } from '@tanzlate/core';
import { contextCoreStub, CoreContext } from '@tanzlate/vanilla';
import type { TOptions } from 'i18next';
import { inject, onUnmounted, provide, ref } from 'vue';
import { I18nContext, i18nKey } from '../types/i18n-key';

export function setupI18nContext() {
  const lang = ref('en');
  const context: I18nContext = {
    ctx: contextCoreStub(),
    lang,
  };
  provide(i18nKey, context);

  let unsubscribe: (() => void) | undefined;
  onUnmounted(() => unsubscribe?.());

  return function resolve(ctx: CoreContext) {
    context.ctx = ctx;
    lang.value = ctx.i18nApp.language;
    unsubscribe = ctx.onLangChange((lng: string) => {
      lang.value = lng;
    });
  };
}

export function useI18n(ns: string) {
  const context = inject(i18nKey);

  if (!context) {
    throw new Error(
      `[tanzlate] useI18n('${ns}') found no i18n context. Call it from a component ` +
        'rendered inside <I18nProvider>, not from a parent or from outside setup(). ' +
        'In a test, provide one directly: provide(i18nKey, { ctx, lang }).',
    );
  }

  const { ctx, lang } = context;
  const helper = ctx.composeHelper(ns);
  const globalHelper = ctx.composeHelper('global');

  return {
    tanz: ((key: InputNamespaces, opts?: TOptions) => {
      void lang.value;
      return helper(key, opts);
    }) as TFunc,
    globalT: ((key: InputNamespaces, opts?: TOptions) => {
      void lang.value;
      return globalHelper(key, opts);
    }) as TFunc,
    lang,
    changeLanguage: ctx.lang,
    i18nApp: ctx.i18nApp,
  };
}
