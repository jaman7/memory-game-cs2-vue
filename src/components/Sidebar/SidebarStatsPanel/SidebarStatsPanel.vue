<template>
  <div class="sidebar-stats-panel">
    <h3 class="sidebar-stats-panel--title">{{ $t('sidebar.statsTitle') }}</h3>
    <p>
      {{ $t('sidebar.gamesPlayed') }}: <span>{{ stats.games }}</span>
    </p>
    <p>
      {{ $t('sidebar.avgTime') }}: <span>{{ stats.avgTime }}</span>
    </p>
    <p>
      {{ $t('sidebar.avgMoves') }}: <span>{{ stats.avgMoves }}</span>
    </p>
    <p>
      {{ $t('sidebar.totalMatches') }}: <span>{{ stats.totalMatches }}</span>
    </p>
    <p>
      {{ $t('sidebar.totalMismatches') }}: <span>{{ stats.totalMismatches }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useFormattedTime } from '@/hooks/useFormattedTime';
import { useGameHistoryStore } from '@/stores/useGameHistoryStore';

defineOptions({
  inheritAttrs: false,
});
defineProps<{}>();

const { history } = useGameHistoryStore();

const stats = computed(() => {
  const games = history.length;
  const avgTime = useFormattedTime(ref(games ? Math.round(history.reduce((a, e) => a + e.time, 0) / games) : 0)).value;
  const avgMoves = games ? Math.round(history.reduce((a, e) => a + e.moves, 0) / games) : 0;
  const totalMatches = history.reduce((a, e) => a + (e.matchCount ?? 0), 0);
  const totalMismatches = history.reduce((a, e) => a + (e.mismatchCount ?? 0), 0);
  return { games, avgTime, avgMoves, totalMatches, totalMismatches };
});
</script>

<style scoped src="./SidebarStatsPanel.scss" />
