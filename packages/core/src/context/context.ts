import { Namespace } from 'i18next';
import { initI18nConfig } from '../init-i18n-config';
import { Createi18nConfigParams, cTFunc, InputNamespaces } from '../types';
import { I18nApp } from '../types/i18n-app';
import { changeLanguage, i18nFormatterHelper, i18nFormatterMock } from '../utils';

export { contextCoreStub, tanzlateContext, tanzlateContextStub, useCoreContext };
export type { CoreContext };

export interface CoreContextParams {
  config: Createi18nConfigParams;
  ssr?: boolean;
  callbackWhenLanguageChange?: (lng: string) => void;
}

interface CoreContext {
  i18nApp: I18nApp;
  translationHelper: (level2: Namespace | string) => cTFunc;
  globalNSHelper?: cTFunc;
  composeHelper(level2: string): cTFunc;
  lang: (lng?: string) => Promise<void>;
  onLangChange: (callback: (lng: string) => void) => () => void;
}

const tanzlateContextStub: CoreContext = {
  i18nApp: {} as I18nApp,
  translationHelper: () => () => '',
  globalNSHelper: () => '',
  composeHelper: () => () => '',
  lang: async () => {},
  onLangChange: () => () => {},
};

/**
 * Creates a stub core context with default values
 *
 * @returns {CoreContext}
 */
function contextCoreStub(): CoreContext {
  const { translationHelper } = i18nFormatterMock();

  return { ...tanzlateContextStub, translationHelper };
}

/**
 * Hook to initialize and provide base core i18nApp context
 *
 * @async
 * @param {Createi18nConfigParams} config
 * @returns {Promise<CoreContext>}
 */
async function useCoreContext({
  config,
  ssr = typeof window === 'undefined',
  callbackWhenLanguageChange,
}: CoreContextParams): Promise<CoreContext> {
  // if (import.meta.env.SSR || !config) {
  if (ssr || !config) {
    return contextCoreStub();
  }

  const i18nApp = await initI18nConfig(config);

  if (!i18nApp) {
    return contextCoreStub();
  }

  const { translationHelper } = i18nFormatterHelper(i18nApp);

  /**
   * Change the current language.
   *
   * @async
   * @param {?string} [lng]
   * @returns {*}
   */
  async function lang(lng?: string) {
    const target = lng || (config.fallbackLng as string) || 'en';
    if (i18nApp.language !== target) {
      await changeLanguage(i18nApp, target);
    }
  }

  /**
   * Return helper associated to global namespace
   * @param ns
   * @returns {string}
   *
   * @example
   * {
   *  "namespace": {
   *   "key_from_global_namespace": "This is a global translation"
   *  }
   * }
   *
   * Usage:
   * globalNSHelper('key_from_global_namespace');
   * // returns "This is a global translation"
   */
  const globalNSHelper: cTFunc = (ns: InputNamespaces) => {
    return composeHelper('global')(ns);
  };

  /**
   * Utility to create own translation helper based on level2 namespace
   */
  function composeHelper(level2: string): cTFunc {
    return translationHelper(level2);
  }

  // i18nApp.onLangChange(() => {
  //   translationHelper = i18nFormatterHelper(i18nApp).translationHelper;
  //   // log(`📟 - languageChanged → ${lng}`);
  // });

  // function onLangChange(cb: (lng: string) => void) {
  //   i18nApp.onLangChange(cb);
  //   cb(i18nApp.language);
  //   return function unsubscribe(): void {
  //     i18nApp.onLangChange(() => { });
  //   };
  // }

  /**
   * Helper/wrapper to provide to specific Frameworks (e.g. Vue, React) to listen to language changes
   * See docs: https://www.i18next.com/overview/api#events
   */
  function onLangChange(cb: (lng: string) => void) {
    i18nApp.on('languageChanged', callbackWhenLanguageChange || cb);
    cb(i18nApp.language);
    return function unsubscribe(): void {
      i18nApp.off('languageChanged', callbackWhenLanguageChange || cb);
    };
  }

  return { i18nApp, translationHelper, globalNSHelper, composeHelper, lang, onLangChange };
}

/**
 * Creates and returns a Tanzlate context. Handles SSR by returning the stub.
 *
 * @async
 * @param {Createi18nConfigParams} options
 * @param {{ ssr?: boolean, callbackWhenLanguageChange?: (lng: string) => void }} [param0={}]
 * @returns {Promise<CoreContext>}
 */
async function tanzlateContext(
  options: Createi18nConfigParams,
  {
    ssr = typeof window === 'undefined',
    callbackWhenLanguageChange,
  }: { ssr?: boolean; callbackWhenLanguageChange?: (lng: string) => void } = {},
): Promise<CoreContext> {
  if (ssr || !options) {
    return tanzlateContextStub;
  }
  return useCoreContext({ config: options, ssr, callbackWhenLanguageChange });
}
