<template>
  <div v-if="lastMatch?.result" class="sidebar-last-match" :class="lastMatch?.result">
    <p class="label" :class="lastMatch?.result">
      <template v-if="lastMatch?.result === 'match'"><VIcon name="fa-check" /> {{ $t('sidebar.matches.match') }}</template>
      <template v-else><VIcon name="fa-times" /> {{ $t('sidebar.matches.mismatch') }}</template>
    </p>
    <div class="tiles">
      <div class="tile-preview">
        <LazyImage :src="lastMatch?.a?.imagePath" :alt="lastMatch?.a?.name" :className="lastMatch?.result" />
        <span class="name">{{ lastMatch?.a?.name }}</span>
      </div>
      <div class="tile-preview">
        <LazyImage :src="lastMatch?.b?.imagePath" :alt="lastMatch?.b?.name" :className="lastMatch?.result" />
        <span class="name">{{ lastMatch?.b?.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/useGameStore';
import './Matches.scss';

const gameStore = useGameStore();
const lastMatch = computed(() => gameStore.matchedPairs?.[gameStore?.matchedPairs?.length - 1] ?? null);
</script>
