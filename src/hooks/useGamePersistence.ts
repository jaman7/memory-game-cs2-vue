import type { GameState } from '@/components/GameCanvas/GameCanvas.types';
import { useGameStateStorage } from './useGameStateStorage';

export function useGamePersistence(seed: string, difficulty: number) {
  const { save, load, clear } = useGameStateStorage();

  function saveState(state: GameState) {
    save(state);
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
