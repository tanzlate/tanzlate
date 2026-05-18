import { i18n } from 'i18next';
import { beforeEach, describe, expect, test } from 'vitest';
import { changeLanguage } from '../../src/utils/change-language';
import { getFormatterFunctions, initi18nConfig } from './i18n';

describe('Create a custom config and access translation keys through formatter', () => {
  let i18next: i18n;

  beforeEach(async () => {
    i18next = await initi18nConfig();
  });

  test('i18next configuration', async () => {
    expect(i18next).toBeDefined();
    expect(i18next.language).toEqual('en');
    expect(i18next.languages).toEqual(['en']);
  });

  test('Access translation keys through formatter', async () => {
    const { translationHelper } = getFormatterFunctions(i18next);
    expect(translationHelper).toBeDefined();

    const tanz = translationHelper('compose_translations');
    expect(tanz).toBeDefined();

    const keyValue = tanz('test_key');
    expect(keyValue).toEqual('Value of test key2');
    expect(tanz('test_key')).toMatchSnapshot();
  });

  test('Change language and access translation keys', async () => {
    await changeLanguage(i18next, 'de');
    expect(i18next.language).toEqual('de');
    expect(i18next.languages).toEqual(['de', 'en']);
    const { translationHelper } = getFormatterFunctions(i18next);
    const tanz = translationHelper('compose_translations');
    expect(tanz).toBeDefined();
    expect(tanz('test_key')).toEqual('Wert des Testschlüssels2');
    expect(tanz('test_key')).toMatchSnapshot();
  });

  test('Dynamically change language by accessing a key in different language', async () => {
    const { translationHelper } = getFormatterFunctions(i18next);
    expect(translationHelper).toBeDefined();

    const tanz = translationHelper('compose_translations');
    expect(tanz).toBeDefined();

    const keyValue = tanz('test_key');
    expect(keyValue).toEqual('Value of test key2');

    await changeLanguage(i18next, 'de');
    expect(i18next.language).toEqual('de');
    expect(i18next.languages).toEqual(['de', 'en']);

    const keyValueDe = tanz('test_key');
    expect(keyValueDe).toEqual('Wert des Testschlüssels2');
    expect(tanz('test_key')).toMatchSnapshot();
  });
});
