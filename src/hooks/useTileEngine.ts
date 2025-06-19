import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import type { Ref } from 'vue';

export function useTileEngine(tiles: Ref<Tile[]>, tileSize: Ref<number>) {
  function getTileAt(x: number, y: number): Tile | null {
    return (
      tiles.value.find((tile) => {
        return x >= tile.x && x <= tile.x + tileSize.value && y >= tile.y && y <= tile.y + tileSize.value && !tile.flipped && !tile.matched;
      }) ?? null
    );
  }

  function isMatchByName(tileA: Tile, tileB: Tile): boolean {
    return tileA.name === tileB.name;
  }

  return {
    getTileAt,
    isMatchByName,
  };
}
