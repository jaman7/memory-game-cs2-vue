import type { GameState } from '@/components/GameCanvas/GameCanvas.types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'memory-game-state';

export function useGameStateStorage() {
  const { data: gameState, clear } = useLocalStorage<GameState | null>(STORAGE_KEY, null);

  function save(state: GameState) {
    gameState.value = {
      dateStart: state.dateStart ?? new Date().toISOString(),
      tiles: state.tiles,
      elapsedSeconds: state.elapsedSeconds,
      moves: state.moves,
      seed: state.seed,
      difficulty: state.difficulty,
      matchedPairs: state?.matchedPairs ?? [],
      matchCount: state?.matchCount ?? 0,
      mismatchCount: state?.mismatchCount ?? 0,
    };
  }
  function load(): GameState | null {
    return gameState.value;
  }

  return {
    gameState,
    save,
    load,
    clear,
  };
}
