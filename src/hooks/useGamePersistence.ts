import type { GameState } from '@/components/GameCanvas/GameCanvas.types';
import { useGameStateStorage } from './useGameStateStorage';

export function useGamePersistence(seed: string, difficulty: number) {
  const { save, load, clear } = useGameStateStorage();

  function saveState(state: GameState) {
    save({
      dateStart: state.dateStart ?? new Date().toISOString(),
      tiles: state.tiles,
      elapsedSeconds: state.elapsedSeconds,
      moves: state.moves,
      seed: state.seed,
      difficulty: state.difficulty,
      matchedPairs: state?.matchedPairs ?? [],
      matchCount: state?.matchCount ?? 0,
      mismatchCount: state?.mismatchCount ?? 0,
    });
  }

  function loadState() {
    return load();
  }

  function clearState() {
    clear();
  }

  return {
    saveState,
    loadState,
    clearState,
  };
}
