<template>
  <transition name="fade" mode="out-in">
    <div class="sidebar">
      <div class="locale-switcher">
        <Button
          v-for="lang in locales"
          :key="lang.code"
          :handleClick="() => setLocale(lang.code)"
          :aria-label="lang.label"
          :active="currentLocale === lang.code"
          variant="round"
        >
          <img :src="lang.flag" alt="" class="flag" />
        </Button>
      </div>

      <h2 class="sidebar-title">{{ $t('sidebar.title') }}</h2>

      <div class="sidebar-info">
        <p>
          <strong>{{ $t('sidebar.time') }}</strong> {{ formattedTime }}
        </p>
        <p>
          <strong>{{ $t('sidebar.moves') }}</strong> {{ gameStore.moves }}
        </p>
        <p>
          <strong>{{ $t('sidebar.seed') }}</strong> {{ gameStore.seed }}
        </p>
        <p>
          <strong>{{ $t('sidebar.difficulty') }}</strong> {{ difficultyLabel }}
        </p>
      </div>

      <div class="sidebar-buttons">
        <Button :handleClick="() => $emit('restart')" :name="'sidebar.buttonReplay'" />
        <Button :name="'sidebar.buttonNew'" :handleClick="() => $emit('newGame')" />
      </div>

      <VolumeControl />

      <div class="d-block">
        <Button name="Dev Tools" :handleClick="gameStore.toggleDevPanel" variant="secondary" class="mt-4" />
      </div>

      <CollapsiblePanel :title="$t('history.title')">
        <GameHistory :history="history" />
      </CollapsiblePanel>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useFormattedTime } from '@/hooks/useFormattedTime';
import { localeOptions } from '@/i18n/locales';
import { loadLocale } from '@/main';
import { useGameHistoryStore } from '@/stores/useGameHistoryStore';
import { useGameStore } from '@/stores/useGameStore';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const gameStore = useGameStore();
const { history } = useGameHistoryStore();

const currentLocale = ref(locale.value);
const locales = localeOptions;
const elapsed = computed(() => gameStore.elapsed);
const formattedTime = useFormattedTime(elapsed);
const isMobile = computed(() => window.innerWidth < 1024);

const difficultyLabel = computed(() => {
  switch (gameStore.difficulty) {
    case 1:
      return t('difficultyDict.easy');
    case 2:
      return t('difficultyDict.medium');
    case 3:
      return t('difficultyDict.hard');
    default:
      return t('difficultyDict.unknown');
  }
});

async function setLocale(code: string) {
  if (code === locale.value) return;
  await loadLocale(code);
  localStorage.setItem('user-locale', code);
  locale.value = code;
  currentLocale.value = code;
}

defineEmits(['restart', 'newGame']);
</script>

<style scoped src="./Sidebar.scss" />
