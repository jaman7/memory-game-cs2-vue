<template>
  <div :class="['sidebar', { open: gameStore.sidebarVisible }]">
    <Button className="sidebar-close" variant="round" :handleClick="() => gameStore.toggleSidebar(!gameStore.sidebarVisible)" aria-label="Zamknij panel">
      <VIcon name="fa-chevron-down" :class="{ rotated: gameStore.sidebarVisible }" class="arrow-icon" />
    </Button>

    <div class="sidebar-container">
      <div class="locale-switcher">
        <Button
          v-for="lang in locales"
          :key="lang.code"
          :handleClick="() => setLocale(lang.code)"
          :aria-label="lang.label"
          :active="currentLocale === lang.code"
          variant="round"
        >
          <LazyImage :src="lang.flag" alt="" className="flag" />
        </Button>
      </div>

      <h2 class="sidebar-title">{{ $t('sidebar.title') }}</h2>

      <div class="sidebar-info">
        <p>
          <strong>{{ $t('sidebar.time') }}</strong> {{ formattedTime ?? '' }}
        </p>
        <p>
          <strong>{{ $t('sidebar.dateStart') }}</strong> {{ formattedDateTime ?? '' }}
        </p>
        <p>
          <strong>{{ $t('sidebar.moves') }}</strong> {{ gameStore.moves ?? 0 }}
        </p>
        <p>
          <strong>{{ $t('sidebar.matchCount') }}</strong> {{ gameStore.matchCount ?? 0 }}
        </p>
        <p>
          <strong>{{ $t('sidebar.mismatchCount') }}</strong> {{ gameStore.mismatchCount ?? 0 }}
        </p>
        <p>
          <strong>{{ $t('sidebar.seed') }}</strong> {{ gameStore.seed ?? '' }}
        </p>
        <p>
          <strong>{{ $t('sidebar.difficulty') }}</strong> {{ difficultyLabel ?? '' }}
        </p>
      </div>

      <div class="sidebar-buttons">
        <Button :handleClick="() => $emit('restart')" :name="'sidebar.buttonReplay'" />
        <Button :name="'sidebar.buttonNew'" :handleClick="() => $emit('newGame')" />
      </div>

      <VolumeControl />

      <div class="sidebar-stats">
        <h3>{{ $t('sidebar.statsTitle') }}</h3>
        <p>{{ $t('sidebar.gamesPlayed') }}: {{ stats.games }}</p>
        <p>{{ $t('sidebar.avgTime') }}: {{ stats.avgTime }}</p>
        <p>{{ $t('sidebar.avgMoves') }}: {{ stats.avgMoves }}</p>
        <p>{{ $t('sidebar.totalMatches') }}: {{ stats.totalMatches }}</p>
        <p>{{ $t('sidebar.totalMismatches') }}: {{ stats.totalMismatches }}</p>
      </div>

      <Matches />

      <CollapsiblePanel :title="$t('rarityLegend.title')">
        <div class="rarity-legend">
          <div v-for="rarity in rarities" :key="rarity" class="legend-item">
            <span class="legend-color" :style="{ backgroundColor: RarityColors[rarity] }" />
            <span>{{ $t('rarityLegend.' + rarity) }}</span>
          </div>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel :title="$t('history.title')">
        <GameHistory :history="history" />
      </CollapsiblePanel>

      <div class="d-block">
        <Button name="sidebar.buttonDevTools" :handleClick="gameStore.toggleDevPanel" variant="secondary" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { rarities, RarityColors } from '@/components/GameCanvas/GameCanvas.const';
import { useFormattedTime } from '@/hooks/useFormattedTime';
import { localeOptions } from '@/i18n/locales';
import { loadLocale } from '@/main';
import { useGameHistoryStore } from '@/stores/useGameHistoryStore';
import { useGameStore } from '@/stores/useGameStore';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import './Sidebar.scss';

const { t, locale } = useI18n();
const gameStore = useGameStore();
const { history } = useGameHistoryStore();

const currentLocale = ref(locale.value);
const locales = localeOptions;
const elapsed = computed(() => gameStore.elapsed);
const formattedTime = useFormattedTime(elapsed);
const formattedDateTime = useDateFormat(gameStore.dateStart ?? '', 'YYYY-MM-DD HH:mm:ss');

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

const stats = computed(() => {
  const games = history.length;
  const avgTime = useFormattedTime(ref(games ? Math.round(history.reduce((a, e) => a + e.time, 0) / games) : 0)).value;
  const avgMoves = games ? Math.round(history.reduce((a, e) => a + e.moves, 0) / games) : 0;
  const totalMatches = history.reduce((a, e) => a + (e.matchCount ?? 0), 0);
  const totalMismatches = history.reduce((a, e) => a + (e.mismatchCount ?? 0), 0);
  return { games, avgTime, avgMoves, totalMatches, totalMismatches };
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
