import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { animateFlip } from '@/shared/utils/animationUtils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/utils/canvasRenderer', () => ({
  drawTileWithFlip: vi.fn(),
}));

describe('animateFlip', () => {
  it('should animate flip and call drawTileWithFlip for 10 frames', async () => {
    vi.useFakeTimers();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const clearRectSpy = vi.spyOn(ctx, 'clearRect');

    const tile: Tile = {
      id: 1,
      name: 'test',
      rarity: 'consumer',
      pairId: 1,
      flipped: false,
      matched: false,
      x: 50,
      y: 50,
      imagePath: '',
    };

    const promise = animateFlip(tile, canvas, 100);

    for (let i = 0; i < 10; i++) {
      vi.runOnlyPendingTimers();
    }

    await promise;

    const { drawTileWithFlip } = await import('@/shared/utils/canvasRenderer');
    expect(drawTileWithFlip).toHaveBeenCalledTimes(11);
    expect(clearRectSpy).toHaveBeenCalledTimes(11);

    vi.useRealTimers();
  });
});
