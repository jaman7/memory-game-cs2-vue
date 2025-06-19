import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { generateShuffledTiles } from '@/shared/utils/generateTiles';
import { isDifficultyType } from '@/shared/utils/isDifficultyType';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useGameStore = defineStore('game', () => {
  const seed = ref('');
  const difficulty = ref(1);
  const tiles = ref<Tile[]>([]);
  const moves = ref(0);
  const elapsed = ref(0);
  const gameStarted = ref(false);
  const gameOver = ref(false);
  const devPanelVisible = ref(false);

  function startGame(payload: { seed: string; difficulty: number }) {
    const newSeed = payload.seed?.trim() || Date.now().toString();
    const newDifficulty = isDifficultyType(payload.difficulty) ? payload.difficulty : 1;

    seed.value = newSeed;
    difficulty.value = newDifficulty;

    const generatedTiles = generateShuffledTiles(newSeed, newDifficulty);
    tiles.value = generatedTiles;
    moves.value = 0;
    elapsed.value = 0;
    gameOver.value = false;
    gameStarted.value = true;
  }

  function restartGame() {
    const generatedTiles = generateShuffledTiles(seed.value, difficulty.value);
    tiles.value = generatedTiles;
    moves.value = 0;
    elapsed.value = 0;
    gameOver.value = false;
  }

  function restoreGame(state: { tiles: Tile[]; elapsedSeconds: number; moves: number; seed: string; difficulty: number }) {
    seed.value = state.seed;
    difficulty.value = state.difficulty;
    tiles.value = state.tiles;
    elapsed.value = state.elapsedSeconds;
    moves.value = state.moves;
    gameStarted.value = true;
    gameOver.value = false;
  }

  function incrementMoves() {
    moves.value++;
  }

  function incrementTime() {
    elapsed.value++;
  }

  function setGameOver(val: boolean) {
    gameOver.value = val;
  }

  function setGameStarted(val: boolean) {
    gameStarted.value = val;
  }

  function toggleDevPanel() {
    devPanelVisible.value = !devPanelVisible.value;
  }

  const gameState = computed(() => ({
    tiles: tiles.value,
    elapsedSeconds: elapsed.value,
    moves: moves.value,
    seed: seed.value,
    difficulty: difficulty.value,
  }));

  return {
    seed,
    difficulty,
    tiles,
    moves,
    elapsed,
    gameStarted,
    gameOver,
    startGame,
    restartGame,
    restoreGame,
    incrementMoves,
    incrementTime,
    setGameOver,
    setGameStarted,
    gameState,
    devPanelVisible,
    toggleDevPanel,
  };
});
