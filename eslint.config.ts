import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import pluginVue from 'eslint-plugin-vue';
import { globalIgnores } from 'eslint/config';
import vueParser from 'vue-eslint-parser';

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/recommended'],
  pluginVue.configs['flat/strongly-recommended'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['**/__tests__/**/*', '**/*.spec.*', '**/*.test.*'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'vue/no-parsing-error': 'error',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/lang': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/alt-text': 'warn',
    },
  },

  skipFormatting
);
