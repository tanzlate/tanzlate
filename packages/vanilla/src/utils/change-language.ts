import { I18nApp } from '../types';

export const localStorageLangKey = 'lang';

export type ChangeLanguageFunc = (i18n: I18nApp, lang: string) => Promise<void>;

export const changeLanguage: ChangeLanguageFunc = async (i18n: I18nApp, lang: string) => {
  await i18n.changeLanguage(lang);
};
