export { mocki18nConfig };

const mocki18nConfig = {
  namespace: 'test_ns',
  fallbackLng: 'en',
  ns: ['test_ns'],
  lng: 'en',
  supportedLanguages: ['en', 'de'],
  debug: false,
  resources: {
    en: {
      test_ns: {
        compose_translations: {
          test_key: 'Value of test key2',
        },
      },
    },
    de: {
      test_ns: {
        compose_translations: {
          test_key: 'Wert des Testschlüssels2',
        },
      },
    },
  },
};
