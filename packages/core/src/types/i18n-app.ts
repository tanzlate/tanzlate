import { i18n, InitOptions } from 'i18next';
import { Createi18nConfigParams } from './config';

export type { I18nApp };

interface I18nApp extends i18n {
  initOptions?: InitOptions;
  initTanz(cfg: Createi18nConfigParams): Promise<I18nApp>;
  // onLangChange(callback: (lng: string) => void): () => void;
}
// TODO: create custom i18n instance that extends i18next i18n
