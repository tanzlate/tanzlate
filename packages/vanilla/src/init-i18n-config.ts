import { InitOptions } from 'i18next';
import type { FsBackendOptions } from 'i18next-fs-backend';
import { createI18nAppInstance } from './i18n-app';
import { I18nApp } from './types';
import { Createi18nConfigParams } from './types/config';

export { initI18nConfig };

const i18NConfigOptions: InitOptions = {
  fallbackLng: 'en',
  preload: ['en', 'en'],
  interpolation: {
    escapeValue: false,
  },
  initImmediate: true,
};

/**
 * Initializes and configures an i18nApp instance which extends i18n to support custom methods and properties.
 *
 * @param {Createi18nConfigParams} params - Custom configuration parameters for i18n
 * @returns {Promise<I18nApp>} - A promise that resolves to the initialized i18n instance
 */
async function initI18nConfig({
  namespace,
  fallbackLng,
  preload,
  lng,
  supportedLanguages,
  resources,
  initAsync = false,
  backend,
}: Createi18nConfigParams): Promise<I18nApp> {
  const initializedI18n = createI18nAppInstance();

  const i18NConfig: InitOptions = {
    ...i18NConfigOptions,
    ns: namespace,
    fallbackLng,
    preload,
    lng,
    supportedLngs: supportedLanguages,
    resources,
    initAsync,
  };

  // const opts = configureOptions(i18NConfig);

  if (backend) {
    const { default: FsBackend } = await import('i18next-fs-backend');
    initializedI18n.use(FsBackend);
    const fsBackendConfig: FsBackendOptions = {
      loadPath: backend?.loadPath,
      addPath: backend?.addPath,
      ident: backend?.ident,
      parse: backend?.parse,
      stringify: backend?.stringify,
      expirationTime: backend?.expirationTime,
    };
    i18NConfig.backend = fsBackendConfig;
  }

  await initializedI18n.init(i18NConfig);

  return initializedI18n;
}
