<template>
  <div class="layout">
    <Spinner v-if="isLoading" size="large" ariaLabel="Ładowanie grafik..." />
    <StartModal v-else-if="!gameStore.gameStarted && !gameStore.gameOver" :key="'gamenew'" @start="handleStart" />
    <GameCanvas v-else :seed="gameStore.seed" :key="'gamecanvas'" :difficulty="gameStore.difficulty" @newGame="handleStartModal" />
    <transition name="fade-panel">
      <DevPanel v-if="gameStore.devPanelVisible" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useGameStart } from './hooks/useGameStart';
import { useGameStateStorage } from './hooks/useGameStateStorage';
import { useGameHistoryStore } from './stores/useGameHistoryStore';
import { useGameStore } from './stores/useGameStore';

const gameStore = useGameStore();
const { isLoading, startGame } = useGameStart();
const { load } = useGameStateStorage();

defineEmits<{
  (e: 'newGame'): void;
}>();

async function handleStart(payload: { seed: string; difficulty: number }) {
  const result = await startGame(payload);
  gameStore.startGame(result);
}

async function handleStartModal(e: string) {
  gameStore.setGameStarted(false);
  if (gameStore.gameOver) gameStore.setGameOver(false);
}

onMounted(() => {
  const saved = load();
  useGameHistoryStore().loadFromStorage();
  if (saved) {
    const anyMatched = saved.tiles.some((t) => t.matched);
    if (anyMatched) {
      gameStore.restoreGame(saved);
    } else {
      gameStore.setGameStarted(false);
    }
  }
});
</script>
