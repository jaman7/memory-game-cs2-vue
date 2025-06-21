import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { drawBoard } from '@/shared/utils/canvasRenderer';
import type { Ref } from 'vue';
import { ref, watchEffect } from 'vue';

export function useThrottledDraw(
  canvasRef: Ref<HTMLCanvasElement | null>,
  tiles: Ref<Tile[]>,
  mouseX: Ref<number>,
  mouseY: Ref<number>,
  hoveredTileId: Ref<number | null>,
  tileSize: Ref<number>
) {
  const needsRedraw = ref(false);
  let animationFrameId: number | null = null;

  function triggerDraw() {
    if (!needsRedraw.value) {
      needsRedraw.value = true;
      scheduleDraw();
    }
  }

  function scheduleDraw() {
    if (animationFrameId !== null) return;
    animationFrameId = requestAnimationFrame(() => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      drawBoard(ctx, canvas, tiles.value, { x: mouseX.value, y: mouseY.value }, hoveredTileId.value, tileSize.value);

      needsRedraw.value = false;
      animationFrameId = null;
    });
  }

  watchEffect(() => {
    triggerDraw();
  });

  return {
    triggerDraw,
  };
}
