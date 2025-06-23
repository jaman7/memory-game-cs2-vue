<template>
  <div class="layout">
    <Spinner v-if="isLoading" key="loading" size="large" ariaLabel="Loading..." />
    <GameCanvas v-if="gameStore.gameStarted" key="canvas" :seed="gameStore.seed" :difficulty="gameStore.difficulty" @newGame="handleStartModal" />
    <GameCanvasDemo v-if="!gameStore.gameStarted && !isLoading" class="preview-bg" />
  </div>

  <Teleport to="body">
    <transition name="fade-panel"> <StartModal v-if="!gameStore.gameStarted && !isLoading" key="start" @start="handleStart" /></transition>
    <transition name="fade-panel">
      <DevPanel v-if="gameStore.devPanelVisible" />
    </transition>
  </Teleport>
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

async function handleStartModal() {
  gameStore.setGameStarted(false);
  gameStore.setGameOver(false);
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
