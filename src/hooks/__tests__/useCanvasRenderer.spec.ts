import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';
import { drawBoard } from '@/shared/utils/canvasRenderer';
import { vi } from 'vitest';
import { ref } from 'vue';

vi.mock('@/shared/utils/canvasRenderer', () => ({
  drawBoard: vi.fn(),
}));

describe('useCanvasRenderer', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let tiles: any[];
  let mouseX: any, mouseY: any, hoveredTileId: any, tileSize: any;
  let applyTileLayout: vi.Mock;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    ctx = canvas.getContext('2d');

    tiles = [
      { id: 1, matched: true, haloAngle: 0, x: 10, y: 20, rarity: 'consumer', flipped: false, imagePath: '' },
      { id: 2, matched: false, haloAngle: undefined, x: 50, y: 60, rarity: 'industrial', flipped: true, imagePath: '' },
    ];

    mouseX = ref(0);
    mouseY = ref(0);
    hoveredTileId = ref<number | null>(null);
    tileSize = ref(100);
    applyTileLayout = vi.fn();
  });

  it('redrawCanvas should not call drawBoard if canvas or ctx missing', () => {
    const { redrawCanvas } = useCanvasRenderer(ref(null), ref(tiles), mouseX, mouseY, hoveredTileId, tileSize, applyTileLayout);
    redrawCanvas();
    expect(drawBoard).not.toHaveBeenCalled();
    const { redrawCanvas: redraw2 } = useCanvasRenderer(ref(canvas), ref(tiles), mouseX, mouseY, hoveredTileId, tileSize, applyTileLayout);
    vi.spyOn(canvas, 'getContext').mockReturnValueOnce(null);
    redraw2();
    expect(drawBoard).not.toHaveBeenCalled();
  });

  it('redrawCanvas should call drawBoard with proper args when canvas and context exist', () => {
    const { redrawCanvas } = useCanvasRenderer(ref(canvas), ref(tiles), mouseX, mouseY, hoveredTileId, tileSize, applyTileLayout);
    redrawCanvas();
    expect(drawBoard).toHaveBeenCalledWith(ctx, canvas, tiles, { x: 0, y: 0 }, null, 100, undefined);
  });

  it('layoutAndRedraw calls layout then redraw', () => {
    const { layoutAndRedraw } = useCanvasRenderer(ref(canvas), ref(tiles), mouseX, mouseY, hoveredTileId, tileSize, applyTileLayout);
    layoutAndRedraw();
    expect(applyTileLayout).toHaveBeenCalled();
    expect(drawBoard).toHaveBeenCalled();
  });

  it('startAnimationLoop updates haloAngle and draws via rAF', () => {
    vi.useFakeTimers();
    const rAFspy = vi.spyOn(global, 'requestAnimationFrame');
    const { startAnimationLoop } = useCanvasRenderer(ref(canvas), ref(tiles), mouseX, mouseY, hoveredTileId, tileSize, applyTileLayout);
    startAnimationLoop();
    expect(rAFspy).toHaveBeenCalled();
    const firstCall = rAFspy.mock.calls[0][0] as FrameRequestCallback;
    firstCall(0);
    expect(tiles[0].haloAngle).toBeGreaterThan(0);
    expect(drawBoard).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
