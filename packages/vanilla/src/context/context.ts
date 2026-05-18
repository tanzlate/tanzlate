import { TFunc, i18nFormatterHelper } from '@tanzlate/core';
import { i18n } from 'i18next';
import { initI18nConfig } from '../init-i18n-config';
import { Createi18nConfigParams } from '../types';
import { I18nApp } from '../types/i18n-app';
import { changeLanguage } from '../utils';

export { contextCoreStub, coreContextStub, useCoreContext };

export interface CoreContext {
  i18nApp: i18n;
  composeHelper(level2: string): TFunc;
  lang: (lng?: string) => Promise<void>;
  onLangChange: (callback: (lng: string) => void) => () => void;
}

export interface CoreContextParams {
  config: Createi18nConfigParams;
  ssr?: boolean;
}

const coreContextStub: CoreContext = {
  i18nApp: {} as I18nApp,
  composeHelper: () => () => '',
  lang: async () => {},
  onLangChange: () => () => {},
};

/**
 * Creates a stub CoreContext with safe no-op defaults (used for SSR and fallback).
 *
 * @returns {CoreContext}
 */
function contextCoreStub(): CoreContext {
  return { ...coreContextStub };
}

/**
 * Initializes i18next and returns a {@link CoreContext}.
 * On SSR (`ssr: true`) or when no config is provided, returns the stub context.
 *
 * @param {CoreContextParams} params
 * @returns {Promise<CoreContext>}
 */
async function useCoreContext({
  config,
  ssr = typeof window === 'undefined',
}: CoreContextParams): Promise<CoreContext> {
  if (ssr || !config) {
    return contextCoreStub();
  }

  const i18nApp = await initI18nConfig(config);

  if (!i18nApp) {
    return contextCoreStub();
  }

  const { translationHelper } = i18nFormatterHelper(i18nApp);

  /**
   * Changes the active language. Falls back to `config.fallbackLng` when no argument is given.
   *
   * @param {string} [lng]
   */
  async function lang(lng?: string) {
    const target = lng || (config.fallbackLng as string) || 'en';
    if (i18nApp.language !== target) {
      await changeLanguage(i18nApp, target);
    }
  }

  function composeHelper(level2: string): TFunc {
    return translationHelper(level2);
  }

  function onLangChange(cb: (lng: string) => void) {
    i18nApp.on('languageChanged', cb);
    cb(i18nApp.language);
    return function unsubscribe(): void {
      i18nApp.off('languageChanged', cb);
    };
  }

  return { i18nApp, composeHelper, lang, onLangChange };
}
