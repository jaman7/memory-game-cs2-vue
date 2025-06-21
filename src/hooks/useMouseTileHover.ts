import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { ref, type Ref } from 'vue';
import { useThrottledDraw } from './useThrottledDraw';

export function useMouseTileHover(
  canvasRef: Ref<HTMLCanvasElement | null>,
  tiles: Ref<Tile[]>,
  tileSize: Ref<number>,
  getMousePosition: (e: MouseEvent | TouchEvent) => { x: number; y: number }
) {
  const hoveredTileId = ref<number | null>(null);
  const mouseX = ref(0);
  const mouseY = ref(0);

  const { triggerDraw } = useThrottledDraw(canvasRef, tiles, mouseX, mouseY, hoveredTileId, tileSize);

  function handleMouseMove(e: MouseEvent | TouchEvent) {
    const { x, y } = getMousePosition(e);
    mouseX.value = x;
    mouseY.value = y;

    const hovered = tiles.value.find(
      (tile) => x >= tile.x && x <= tile.x + tileSize.value && y >= tile.y && y <= tile.y + tileSize.value && !tile.matched && !tile.flipped
    );

    hoveredTileId.value = hovered?.id ?? null;

    if (canvasRef.value) {
      canvasRef.value.style.cursor = hoveredTileId.value !== null ? 'pointer' : 'default';
    }

    triggerDraw();
  }

  return {
    hoveredTileId,
    mouseX,
    mouseY,
    handleMouseMove,
  };
}
