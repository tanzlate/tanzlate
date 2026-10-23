import { InitOptions } from 'i18next';
import { createI18nAppInstance } from './i18n-app';
import { I18nApp } from './types';
import { Createi18nConfigParams } from './types/config';

export { initI18nConfig };

const i18NConfigOptions: InitOptions = {
  fallbackLng: 'en',
  preload: ['en'],
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
  modules,
  backend,
  interpolation,
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
    // Caller wins, so escapeValue can be turned back on.
    interpolation: { ...i18NConfigOptions.interpolation, ...interpolation },
  };

  // Plugins must be registered before init.
  for (const module of modules ?? []) {
    initializedI18n.use(module);
  }

  if (backend) {
    if (!modules?.length) {
      throw new Error(
        '[tanzlate] `backend` options were provided but no backend module. ' +
          'Register one via `modules`, e.g. initI18nConfig({ modules: [FsBackend], backend: { loadPath } }).',
      );
    }
    // Passed straight through, so any backend's own options survive.
    i18NConfig.backend = backend;
  }

  await initializedI18n.init(i18NConfig);

  return initializedI18n;
}
