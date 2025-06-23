import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { useMouseTileHover } from '@/hooks/useMouseTileHover';
import { ref } from 'vue';

const triggerDrawMock = vi.fn();

vi.mock('@/hooks/useThrottledDraw', () => ({
  useThrottledDraw: () => ({
    triggerDraw: triggerDrawMock,
  }),
}));

describe('useMouseTileHover', () => {
  let canvas: HTMLCanvasElement;
  let canvasRef: any;
  let tiles: any;
  let tileSize: any;
  let getMousePosition: vi.Mock;
  let hook: ReturnType<typeof useMouseTileHover>;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvasRef = ref(canvas);
    tiles = ref<Tile[]>([{ id: 1, x: 0, y: 0, flipped: false, matched: false, name: 'A', rarity: 'consumer', pairId: 1 }]);
    tileSize = ref<number>(100);
    getMousePosition = vi.fn();
    hook = useMouseTileHover(canvasRef, tiles, tileSize, getMousePosition);
    triggerDrawMock.mockClear();
  });

  it('aktualizuje mouseX i mouseY, gdy ruch myszy', () => {
    getMousePosition.mockReturnValue({ x: 10, y: 10 });
    hook.handleMouseMove({} as MouseEvent);
    expect(hook.mouseX.value).toBe(10);
    expect(hook.mouseY.value).toBe(10);
  });

  it('ustawia hoveredTileId tylko przy nieflipped i nienaprawionym kafelku', () => {
    getMousePosition.mockReturnValue({ x: 10, y: 10 });
    hook.handleMouseMove({} as MouseEvent);
    expect(hook.hoveredTileId.value).toBe(1);

    getMousePosition.mockReturnValue({ x: 110, y: 10 });
    hook.handleMouseMove({} as MouseEvent);
    expect(hook.hoveredTileId.value).toBeNull(); // bo flipped

    getMousePosition.mockReturnValue({ x: 210, y: 10 });
    hook.handleMouseMove({} as MouseEvent);
    expect(hook.hoveredTileId.value).toBeNull(); // bo matched
  });

  it('zmienia kursor w zależności od hoveredTileId', () => {
    getMousePosition.mockReturnValue({ x: 500, y: 500 });
    hook.handleMouseMove({} as MouseEvent);
    expect(canvas.style.cursor).toBe('default');
    getMousePosition.mockReturnValue({ x: 10, y: 10 });
    hook.handleMouseMove({} as MouseEvent);
    expect(canvas.style.cursor).toBe('pointer');
  });

  it('zawsze wywołuje triggerDraw po ruchu myszy', () => {
    getMousePosition.mockReturnValue({ x: 10, y: 10 });
    hook.handleMouseMove({} as MouseEvent);
    expect(triggerDrawMock).toHaveBeenCalled();
  });
});
