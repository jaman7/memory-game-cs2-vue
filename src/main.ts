import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './assests/scss/main.scss';
import { availableLocales, i18n } from './i18n';
import { OhVueIcon } from './icons';

const app = createApp(App);
const pinia = createPinia();

app.use(i18n);
app.use(pinia);
app.component('VIcon', OhVueIcon);

async function loadLocale(locale: string) {
  if (!availableLocales.includes(locale)) return;
  try {
    const messages = await fetch(`/i18n/${locale}.json`).then((res) => res.json());
    i18n.global.setLocaleMessage(locale, messages);
    i18n.global.locale.value = locale;
  } catch (err) {
    console.warn(`Failed to load locale: ${locale}`, err);
  }
}

let initialLocale = localStorage.getItem('user-locale');

if (!initialLocale) {
  const browserLang = navigator.language.split('-')[0];
  if (availableLocales.includes(browserLang)) {
    initialLocale = browserLang;
  } else {
    initialLocale = 'en';
  }
  localStorage.setItem('user-locale', initialLocale);
}

loadLocale(initialLocale).then(() => {
  app.mount('#app');
});

export { loadLocale };
