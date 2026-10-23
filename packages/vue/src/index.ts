export * from './components';
export * from './composables';
// Exported so tests (and anyone composing their own provider) can supply a
// context directly instead of mounting <I18nProvider>.
export { i18nKey } from './types/i18n-key';
export type { I18nContext } from './types/i18n-key';
