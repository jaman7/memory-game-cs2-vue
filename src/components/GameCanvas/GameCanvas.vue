<template>
  <div class="game-canvas">
    <div class="game-content" :class="{ 'with-sidebar': gameStore.sidebarVisible }">
      <div class="game-info">{{ formattedTime }} | {{ $t('game.moves', { n: gameStore.moves }) }}</div>

      <canvas ref="canvasRef" class="game-canvas-element" role="img" :aria-label="$t('game.canvasLabel')" :style="{ height: 'auto' }">
        {{ $t('errors.canvasFallBack') }}
      </canvas>

      <Teleport to="body">
        <transition name="fade-panel">
          <GameOverModal
            v-if="gameStore?.gameOver ?? false"
            :time="formattedTime ?? ''"
            :moves="gameStore.moves ?? 0"
            @restart="restartGame"
            @newgame="goToStart"
          />
        </transition>
      </Teleport>
    </div>

    <Sidebar @restart="restartGame" @newGame="goToStart" />
  </div>
</template>

<script setup lang="ts">
import { useBeforeUnloadBackup } from '@/hooks/useBeforeUnloadBackup';
import { useCanvasLayout } from '@/hooks/useCanvasLayout';
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';
import { useDebouncedRedraw } from '@/hooks/useDebouncedRedraw';
import { useFormattedTime } from '@/hooks/useFormattedTime';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import { useMouseCanvasPosition } from '@/hooks/useMouseCanvasPosition';
import { useMouseTileHover } from '@/hooks/useMouseTileHover';
import { useResizeObserver } from '@/hooks/useResizeObserver';
import { useTileInteractions } from '@/hooks/useTileInteractions';
import { useTimer } from '@/hooks/useTimer';
import { sounds } from '@/shared/sounds/sounds';
import { throttle } from '@/shared/utils/throttle';
import { useGameHistoryStore } from '@/stores/useGameHistoryStore';
import { useGameStore } from '@/stores/useGameStore';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  seed: string;
  difficulty: number;
}>();

const emit = defineEmits(['restart', 'newGame']);

const gameStore = useGameStore();
const historyStore = useGameHistoryStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const parentElement = ref<HTMLElement | null>(null);
const currentTileSize = ref(100);
const fadeStartTime = ref<number | null>(null);
const tiles = computed(() => gameStore.tiles);

const { saveState, loadState, clearState } = useGamePersistence(gameStore.seed, gameStore.difficulty);

const throttledBackup = throttle(() => {
  saveState(gameStore.gameState);
}, 30000);

const { start, stop, reset } = useTimer(throttledBackup);
const elapsed = computed(() => gameStore.elapsed);
const formattedTime = useFormattedTime(elapsed);

function recordVictoryStats() {
  historyStore.addEntry({
    dateStart: gameStore.dateStart ?? new Date().toISOString(),
    time: gameStore.elapsed,
    moves: gameStore.moves,
    dateEnd: new Date().toISOString(),
    seed: gameStore.seed,
    difficulty: gameStore.difficulty,
    matchCount: gameStore.matchCount,
    mismatchCount: gameStore.mismatchCount,
    matchedPairs: gameStore.matchedPairs,
  });
}

function goToStart() {
  clearState();
  gameStore.setGameStarted(false);
  emit('newGame');
}

const { getMousePosition } = useMouseCanvasPosition(canvasRef);
const { hoveredTileId, mouseX, mouseY, handleMouseMove } = useMouseTileHover(canvasRef, tiles, currentTileSize, getMousePosition);
const { handleClick, resetInteractions, isGameOver } = useTileInteractions(
  canvasRef,
  tiles,
  mouseX,
  mouseY,
  hoveredTileId,
  {
    onGameOver: () => {
      recordVictoryStats();
      stop();
      gameStore.setGameOver(true);
      saveState(gameStore.gameState);
    },
  },
  currentTileSize
);

const { applyTileLayout } = useCanvasLayout(canvasRef, tiles, currentTileSize);

const { startAnimationLoop, layoutAndRedraw } = useCanvasRenderer(
  canvasRef,
  tiles,
  mouseX,
  mouseY,
  hoveredTileId,
  currentTileSize,
  applyTileLayout,
  fadeStartTime
);

const { debouncedRedraw } = useDebouncedRedraw(layoutAndRedraw, 100);

function restartGame() {
  fadeStartTime.value = Date.now();
  gameStore.restartGame();
  gameStore.setGameOver(false);
  gameStore.setGameStarted(true);
  resetInteractions();
  debouncedRedraw();
  clearState();
  reset();
  start();
}

useResizeObserver(parentElement, () => debouncedRedraw());

onMounted(async () => {
  if (!canvasRef.value) return;
  useBeforeUnloadBackup();
  const saved = loadState();
  Object.values(sounds).forEach((s) => s.load());

  if (saved) {
    gameStore.restoreGame(saved);
  }

  resetInteractions();
  await nextTick();
  fadeStartTime.value = Date.now();
  layoutAndRedraw();

  canvasRef.value?.addEventListener('click', handleClick);
  window.addEventListener('mousemove', handleMouseMove);
  canvasRef.value?.addEventListener('touchstart', handleMouseMove, { passive: true });
  canvasRef.value?.addEventListener('touchmove', handleMouseMove, { passive: true });
  canvasRef.value?.addEventListener('touchend', handleClick);

  startAnimationLoop();

  parentElement.value = canvasRef.value?.parentElement ?? null;

  start();
});

onUnmounted(() => {
  stop();
  window.removeEventListener('mousemove', handleMouseMove);
  canvasRef.value?.removeEventListener('click', handleClick);

  canvasRef.value?.removeEventListener('touchstart', handleMouseMove);
  canvasRef.value?.removeEventListener('touchmove', handleMouseMove);
  canvasRef.value?.removeEventListener('touchend', handleClick);
});
</script>

<style scoped src="./GameCanvas.scss" />
