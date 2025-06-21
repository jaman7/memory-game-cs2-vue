import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { drawBoard } from '@/shared/utils/canvasRenderer';
import type { Ref } from 'vue';

export function useCanvasRenderer(
  canvasRef: Ref<HTMLCanvasElement | null>,
  tiles: Ref<Tile[]>,
  mouseX: Ref<number>,
  mouseY: Ref<number>,
  hoveredTileId: Ref<number | null>,
  tileSize: Ref<number>,
  applyTileLayout: () => void,
  fadeStartTime?: Ref<number | null>
) {
  function redrawCanvas() {
    const canvas = canvasRef.value;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    drawBoard(ctx, canvas, tiles.value, { x: mouseX.value, y: mouseY.value }, hoveredTileId.value, tileSize.value, fadeStartTime);
  }

  function startAnimationLoop() {
    function loop() {
      const canvas = canvasRef.value;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        tiles.value.forEach((tile) => {
          if (tile.matched && tile.haloAngle !== undefined) {
            tile.haloAngle = (tile.haloAngle + 0.03) % (Math.PI * 2);
          }
        });
        drawBoard(ctx, canvas, tiles.value, { x: mouseX.value, y: mouseY.value }, hoveredTileId.value, tileSize.value, fadeStartTime);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function layoutAndRedraw() {
    applyTileLayout();
    redrawCanvas();
  }

  return {
    redrawCanvas,
    startAnimationLoop,
    layoutAndRedraw,
  };
}
