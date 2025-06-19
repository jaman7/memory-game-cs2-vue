import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import type { Ref } from 'vue';

export function useGameOverChecker(tiles: Ref<Tile[]>) {
  function checkIfGameOver(): boolean {
    return tiles.value.length > 0 && tiles.value.every((tile) => tile.matched);
  }

  return {
    checkIfGameOver,
  };
}
