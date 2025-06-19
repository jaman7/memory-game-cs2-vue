import { colors } from '@/components/GameCanvas/GameCanvas.const';
import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { drawTileWithFlip } from './canvasRenderer';

export function animateFlip(tile: Tile, canvas: HTMLCanvasElement, size = 100, options: { reverse?: boolean } = {}): Promise<void> {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve();

    const frames = 10;
    const { x, y } = tile;
    let frame = 0;

    function step() {
      if (!ctx) return resolve();
      const progress = options.reverse ? 1 - frame / frames : frame / frames;
      ctx.clearRect(x - 2, y - 2, size + 4, size + 4);
      drawTileWithFlip(ctx, tile, progress, size);

      if (++frame <= frames) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    step();
  });
}

export function drawBoardWithSingleTile(tile: Tile, progress: number, tiles: Tile[], canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = colors.lightGray;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const t of tiles) {
    if (t.id === tile.id) {
      drawTileWithFlip(ctx, t, progress);
    } else {
      drawTileWithFlip(ctx, t, t.flipped || t.matched ? 1 : 0);
    }
  }
}
