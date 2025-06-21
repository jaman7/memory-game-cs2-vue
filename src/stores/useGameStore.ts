import type { GameState, MatchRecord, Tile } from '@/components/GameCanvas/GameCanvas.types';
import { generateShuffledTiles } from '@/shared/utils/generateTiles';
import { isDifficultyType } from '@/shared/utils/isDifficultyType';
import { getTimeStamp } from '@/shared/utils/timeStamp';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useGameStore = defineStore('game', () => {
  const dateStart = ref<string | null>(null);
  const seed = ref('');
  const difficulty = ref(1);
  const tiles = ref<Tile[]>([]);
  const moves = ref(0);
  const elapsed = ref(0);
  const matchCount = ref(0);
  const mismatchCount = ref(0);
  const matchedPairs = ref<MatchRecord[]>([]);
  const gameStarted = ref(false);
  const gameOver = ref(false);
  const sidebarVisible = ref(true);
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
    matchedPairs.value = [];
    matchCount.value = 0;
    mismatchCount.value = 0;
    dateStart.value = new Date().toISOString();
  }

  function restartGame() {
    const generatedTiles = generateShuffledTiles(seed.value, difficulty.value);
    tiles.value = generatedTiles;
    moves.value = 0;
    elapsed.value = 0;
    gameOver.value = false;
    matchedPairs.value = [];
    matchCount.value = 0;
    mismatchCount.value = 0;
  }

  function restoreGame(state: GameState) {
    dateStart.value = state.dateStart ?? null;
    seed.value = state.seed;
    difficulty.value = state.difficulty;
    tiles.value = state.tiles;
    elapsed.value = state.elapsedSeconds;
    moves.value = state.moves;
    gameStarted.value = true;
    gameOver.value = false;
    matchedPairs.value = state?.matchedPairs ?? [];
    matchCount.value = state?.matchCount ?? 0;
    mismatchCount.value = state?.mismatchCount ?? 0;
  }

  function incrementMatch(a: Tile, b: Tile) {
    const { haloAngle: haloAngleA, ...restA } = a ?? {};
    const { haloAngle: haloAngleB, ...restB } = b ?? {};
    matchCount.value++;
    const timestamp = getTimeStamp(dateStart.value as string);
    matchedPairs.value.push({ a: restA, b: restB, result: 'match', timestamp });
  }

  function incrementMismatch(a: Tile, b: Tile) {
    const { haloAngle: haloAngleA, ...restA } = a ?? {};
    const { haloAngle: haloAngleB, ...restB } = b ?? {};
    mismatchCount.value++;
    const timestamp = getTimeStamp(dateStart.value as string);
    matchedPairs.value.push({ a: restA, b: restB, result: 'mismatch', timestamp });
  }

  function resetStats() {
    matchCount.value = 0;
    mismatchCount.value = 0;
    matchedPairs.value = [];
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

  function toggleSidebar(val?: boolean) {
    if (typeof val === 'boolean') sidebarVisible.value = val;
    else sidebarVisible.value = !sidebarVisible.value;
  }

  const gameState = computed(() => ({
    dateStart: dateStart.value,
    tiles: tiles.value,
    elapsedSeconds: elapsed.value,
    moves: moves.value,
    seed: seed.value,
    difficulty: difficulty.value,
    matchCount: matchCount.value ?? 0,
    mismatchCount: mismatchCount.value ?? 0,
    matchedPairs: matchedPairs.value ?? [],
  }));

  return {
    dateStart,
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
    matchCount,
    mismatchCount,
    matchedPairs,
    incrementMatch,
    incrementMismatch,
    resetStats,
    setGameOver,
    setGameStarted,
    gameState,
    devPanelVisible,
    toggleDevPanel,
    sidebarVisible,
    toggleSidebar,
  };
});
