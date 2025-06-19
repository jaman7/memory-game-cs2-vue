import { createI18n } from 'vue-i18n';

export const availableLocales = ['en', 'pl'];

export const i18n = createI18n({
  legacy: false,
  locale: 'pl',
  fallbackLocale: 'en',
  messages: {},
});
