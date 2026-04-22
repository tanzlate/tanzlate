import { useLogger } from '@use-compose/logger';
// import { i18n } from "i18next";

import { createInstance, InitOptions } from 'i18next';
import { Createi18nConfigParams, I18nApp } from './types';

export { configureOptions, createI18nAppInstance };
// interface I18nApp extends i18n {
//   lang:

// TODO: create custom i18n instance that extends i18next i18n

function configureOptions(config: Createi18nConfigParams) {
  // add custom options here
  const baseOptions: InitOptions = {
    fallbackLng: 'en',
    preload: ['en'],
    interpolation: { escapeValue: false },
    initImmediate: true,
  };

  const options = {
    ...baseOptions,
    ...config,
  };

  // if (config.backend) {
  //   options.backend = config.backend;
  // }

  return options;
}

function toInitOptions(cfg: Createi18nConfigParams): InitOptions {
  return {
    ...cfg,
    ns: cfg.namespace,
    supportedLngs: cfg.supportedLanguages,
    backend: cfg.backend,
    resources: cfg.resources,
  };
}

/**
 * Creates an extended i18n instance with custom methods and properties
 * TODO: mandatory?
 *
 * @returns {I18nApp}
 */
function createI18nAppInstance(): I18nApp {
  const { log } = useLogger('createI18nAppInstance');
  // 1. create a base instance
  const base = createInstance();
  // const options = configureOptions(config);
  // keep a reference to the original init
  const originalInit = base.init;

  const extended = Object.assign(base, {
    async initTanz(this: I18nApp, cfg: Createi18nConfigParams): Promise<I18nApp> {
      await originalInit.call(this, toInitOptions(cfg));
      return this;
    },

    // TODO: keep?
    onLangChange(this: I18nApp, callback: (lng: string) => void): () => void {
      this.on('languageChanged', callback);
      // return unsubscribe function
      log(`📟 - onLangChange → ${this.language}`);
      return () => {
        this.off('languageChanged', callback);
      };
    },

    missingTranslationHandler(this: I18nApp, key: string) {
      const { language, exists } = this;
      log(`missingTranslationHandler called - ${language}, exists: ${exists(key)}`);
    },
  }) as I18nApp;

  return extended;
}
