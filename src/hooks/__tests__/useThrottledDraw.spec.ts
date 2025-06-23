import { useThrottledDraw } from '@/hooks/useThrottledDraw';
import { drawBoard } from '@/shared/utils/canvasRenderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';

vi.mock('@/shared/utils/canvasRenderer', () => ({
  drawBoard: vi.fn(),
}));

describe('useThrottledDraw', () => {
  let canvas: HTMLCanvasElement;
  let canvasRef: any;
  let tiles: any;
  let mouseX: any;
  let mouseY: any;
  let hoveredTileId: any;
  let tileSize: any;
  let ctx: any;
  let requestAnimationFrameSpy: any;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    ctx = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      getContext: vi.fn(() => ctx),
    };

    canvas.getContext = vi.fn(() => ctx);
    canvasRef = ref(canvas);
    tiles = ref([]);
    mouseX = ref(0);
    mouseY = ref(0);
    hoveredTileId = ref(null);
    tileSize = ref(100);

    vi.useFakeTimers();
    requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(123);
      return 1;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('should schedule draw only once', () => {
    const { triggerDraw } = useThrottledDraw(canvasRef, tiles, mouseX, mouseY, hoveredTileId, tileSize);
    triggerDraw();
    triggerDraw();
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
  });

  it('should call drawBoard in animation frame', async () => {
    const { triggerDraw } = useThrottledDraw(canvasRef, tiles, mouseX, mouseY, hoveredTileId, tileSize);
    triggerDraw();
    await nextTick();
    expect(drawBoard).toHaveBeenCalledTimes(1);
  });

  it('should not call drawBoard if canvas is null', async () => {
    canvasRef.value = null;
    const { triggerDraw } = useThrottledDraw(canvasRef, tiles, mouseX, mouseY, hoveredTileId, tileSize);
    triggerDraw();
    await nextTick();
    expect(drawBoard).not.toHaveBeenCalled();
  });

  it('should not call drawBoard if context is null', async () => {
    canvas.getContext = vi.fn(() => null);
    const { triggerDraw } = useThrottledDraw(canvasRef, tiles, mouseX, mouseY, hoveredTileId, tileSize);
    triggerDraw();
    await nextTick();
    expect(drawBoard).not.toHaveBeenCalled();
  });
});
