import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'], rules: { 'no-console': 'error' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      'no-console': 'error',
      'vue/multi-word-component-names': [
        'off',
        {
          ignores: ['index'],
        },
      ],
      'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
      '@typescript-eslint/no-empty-object-type': 'off',
    },
    settings: {
      'editor.formatOnSave': true,
      failOnError: true,
      failOnWarn: false,
      '@stylistic/semi': true,
    },
  },
  {
    ignores: [
      '**/dist/',
      '**/cache/',
      '**/.nuxt/',
      '**/.nvm/',
      '**/.output/',
      '**/.husky/',
      '**/example/',
    ],
  },
  eslintConfigPrettier,
];
