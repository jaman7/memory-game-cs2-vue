import type { GameState } from '@/components/GameCanvas/GameCanvas.types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'memory-game-state';

export function useGameStateStorage() {
  const { data: gameState, clear } = useLocalStorage<GameState | null>(STORAGE_KEY, null);

  function save(state: GameState) {
    gameState.value = {
      tiles: state.tiles,
      elapsedSeconds: state.elapsedSeconds,
      moves: state.moves,
      seed: state.seed,
      difficulty: state.difficulty,
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
