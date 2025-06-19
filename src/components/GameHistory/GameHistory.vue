<template>
  <div class="game-history">
    <h2 class="history-title">{{ $t('history.title') }}</h2>
    <ul v-if="history.length > 0" class="history-list">
      <li v-for="(entry, index) in history" :key="index" class="history-item">
        <div class="history-seed">
          <b>{{ entry.seed }}</b> ({{ entry.difficulty }})
        </div>
        <div class="history-details">
          {{ $t('history.timeMoves', { time: entry.time, moves: entry.moves }) }}
        </div>
        <div class="history-date">
          {{ formatDate(entry.date) }}
        </div>
      </li>
    </ul>
    <p v-else class="history-empty">{{ $t('history.error') }}</p>
  </div>
</template>

<script setup lang="ts">
import type { GameHistoryEntry } from '../GameCanvas/GameCanvas.types';

defineProps<{
  history: GameHistoryEntry[];
}>();

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pl-PL');
}
</script>

<style scoped src="./GameHistory.scss" />
