import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { drawBoard } from '@/shared/utils/canvasRenderer';
import { preloadedImages } from '@/shared/utils/imageCache';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('canvasRenderer', () => {
  let ctxMock: CanvasRenderingContext2D;
  let canvasMock: HTMLCanvasElement;

  beforeEach(() => {
    canvasMock = document.createElement('canvas');
    ctxMock = canvasMock.getContext('2d') as CanvasRenderingContext2D;

    vi.spyOn(ctxMock, 'fillRect');
    vi.spyOn(ctxMock, 'drawImage');
    vi.spyOn(ctxMock, 'clearRect');

    for (const key in preloadedImages) delete preloadedImages[key];

    const mockImg = new Image();
    mockImg.src = '/images/weapons/p90.png';
    Object.defineProperty(mockImg, 'complete', { value: true });
    Object.defineProperty(mockImg, 'naturalWidth', { value: 100 });
    Object.defineProperty(mockImg, 'naturalHeight', { value: 100 });

    preloadedImages['/images/weapons/p90.png'] = mockImg;
  });

  it('should clear the canvas before drawing', () => {
    const tiles: Tile[] = [];

    drawBoard(ctxMock, canvasMock, tiles, { x: 0, y: 0 }, null, 100);

    expect(ctxMock.clearRect).toHaveBeenCalledWith(0, 0, canvasMock.width, canvasMock.height);
  });

  it('should draw each tile with preloaded image', () => {
    const tiles: Tile[] = [
      {
        id: 1,
        name: 'tile1',
        rarity: 'consumer',
        pairId: 1,
        flipped: true,
        matched: false,
        x: 0,
        y: 0,
        imagePath: '/images/weapons/p90.png',
      },
    ];

    drawBoard(ctxMock, canvasMock, tiles, { x: 0, y: 0 }, null, 100);

    expect(ctxMock.drawImage).toHaveBeenCalled();
  });
});
