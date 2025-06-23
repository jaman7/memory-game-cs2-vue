import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { useCanvasLayout } from '@/hooks/useCanvasLayout';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref, type Ref } from 'vue';

describe('useCanvasLayout', () => {
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let tiles: Tile[];
  let canvasRef: Ref<HTMLCanvasElement | null>;
  let currentTileSize: Ref<number>;

  beforeEach(() => {
    context = {
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    canvas = document.createElement('canvas');
    Object.defineProperty(canvas, 'getContext', {
      value: vi.fn().mockReturnValue(context),
    });

    tiles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      name: `Tile ${i}`,
      rarity: 'consumer',
      pairId: i,
      flipped: false,
      matched: false,
      x: 0,
      y: 0,
    }));

    canvasRef = ref(canvas);
    currentTileSize = ref<number>(0);
  });

  it('layoutCanvas sets the sizes and transformation', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });

    const { layoutCanvas } = useCanvasLayout(canvasRef, ref(tiles), currentTileSize);
    layoutCanvas(400, 300);

    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
    expect(canvas.style.width).toBe('400px');
    expect(canvas.style.height).toBe('300px');
    expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
  });

  it('applyTileLayout sets the tileSize and tile positions', () => {
    const parent = document.createElement('div');
    Object.defineProperty(parent, 'clientWidth', { value: 600 });
    Object.defineProperty(canvas, 'parentElement', { value: parent, configurable: true });
    document.body.innerHTML = '';
    document.body.appendChild(canvas);

    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });

    const { applyTileLayout } = useCanvasLayout(canvasRef, ref(tiles), currentTileSize);
    applyTileLayout();

    expect(currentTileSize.value).toBeGreaterThan(0);
    tiles.forEach((tile) => {
      expect(tile.x).toBeGreaterThanOrEqual(0);
      expect(tile.y).toBeGreaterThanOrEqual(0);
    });
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
  });

  it('layoutCanvas does nothing when canvasRef is null', () => {
    canvasRef.value = null;
    const { layoutCanvas } = useCanvasLayout(canvasRef, ref(tiles), currentTileSize);
    layoutCanvas(400, 300);
  });

  it('applyTileLayout does nothing when parentElement is null', () => {
    Object.defineProperty(canvas, 'parentElement', { value: null, configurable: true });
    const { applyTileLayout } = useCanvasLayout(canvasRef, ref(tiles), currentTileSize);
    applyTileLayout();
    expect(currentTileSize.value).toBe(0);
  });
});
