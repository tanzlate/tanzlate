import { createInstance } from 'i18next';
import { describe, expect, test } from 'vitest';
import { changeLanguage } from './change-language';

describe('changeLanguage (unit)', () => {
  test('delegates to i18n.changeLanguage', async () => {
    const i18nApp = createInstance({
      lng: 'en',
    });
    await i18nApp.init();
    expect(i18nApp.language).toBe('en');
    await changeLanguage(i18nApp, 'de');
    expect(i18nApp.language).toBe('de');
  });
});
