<template>
  <div class="locale-switcher">
    <Button
      v-for="lang in localeOptions"
      :key="lang.code"
      :handleClick="() => setLocale(lang.code)"
      :aria-label="lang.label"
      :active="locale === lang.code"
      variant="round"
    >
      <LazyImage :src="lang.flag" alt="" className="flag" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { localeOptions } from '@/i18n/locales';
import { loadLocale } from '@/main';
import { useI18n } from 'vue-i18n';
import './SidebarLanguageFlags.scss';

defineOptions({
  inheritAttrs: false,
});
defineProps<{}>();

const { locale } = useI18n();
const setLocale = async (code: string) => {
  if (code !== locale.value) {
    await loadLocale(code);
    localStorage.setItem('user-locale', code);
    locale.value = code;
  }
};
</script>
