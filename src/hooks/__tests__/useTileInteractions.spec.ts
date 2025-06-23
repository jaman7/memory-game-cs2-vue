import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { useTileInteractions } from '@/hooks/useTileInteractions';
import { animateFlip } from '@/shared/utils/animationUtils';
import { handleMatchPair } from '@/shared/utils/handlers/handleMatchPair';
import { handleMismatchPair } from '@/shared/utils/handlers/handleMismatchPair';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Ref } from 'vue';
import { ref } from 'vue';

vi.useFakeTimers();

vi.mock('@/shared/utils/handlers/handleMatchPair', () => ({
  handleMatchPair: vi.fn((a, b, opts) => {
    opts.onMatch?.(a, b);
    return Promise.resolve();
  }),
}));

vi.mock('@/shared/utils/handlers/handleMismatchPair', () => ({
  handleMismatchPair: vi.fn((a, b, opts) => {
    opts.onMismatch?.(a, b);
    return Promise.resolve();
  }),
}));

vi.mock('@/shared/utils/animationUtils', () => ({
  animateFlip: vi.fn(() => Promise.resolve()),
}));
vi.mock('@/shared/utils/canvasRenderer', () => ({
  drawBoard: vi.fn(),
}));

const incrementMovesMock = vi.fn();
const incrementMatchMock = vi.fn();
const incrementMismatchMock = vi.fn();
const setGameOverMock = vi.fn();

vi.mock('@/stores/useGameStore', () => ({
  useGameStore: () => ({
    incrementMoves: incrementMovesMock,
    incrementMatch: incrementMatchMock,
    incrementMismatch: incrementMismatchMock,
    setGameOver: setGameOverMock,
  }),
}));

vi.mock('@/hooks/useClickLock', () => ({
  useClickLock: () => ({
    isLocked: vi.fn(() => false),
    lock: vi.fn(),
    unlock: vi.fn(),
  }),
}));

vi.mock('@/hooks/useGameOverChecker', () => ({
  useGameOverChecker: () => ({ checkIfGameOver: vi.fn(() => false) }),
}));

vi.mock('@/hooks/useSoundEffects', () => ({
  useSoundEffects: () => ({
    playFlip: vi.fn(() => Promise.resolve()),
    playMatch: vi.fn(() => Promise.resolve()),
    playFail: vi.fn(() => Promise.resolve()),
    playWin: vi.fn(() => Promise.resolve()),
  }),
}));

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let tiles: Ref<Tile[]>;
let canvasRef: Ref<HTMLCanvasElement | null>;
let mouseX = ref(0);
let mouseY = ref(0);
let hoveredTileId = ref<number | null>(null);
let tileSize = ref(50);
let onMatch = vi.fn();
let onMismatch = vi.fn();
let onGameOver = vi.fn();

beforeEach(() => {
  context = {
    getContext: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    drawImage: vi.fn(),
  } as unknown as CanvasRenderingContext2D;

  canvas = document.createElement('canvas');
  canvas.getContext = vi.fn().mockReturnValue(context);

  canvasRef = ref<HTMLCanvasElement | null>(null);
  canvasRef.value = canvas;

  tiles = ref([
    { id: 1, x: 0, y: 0, name: 'A', flipped: false, matched: false, pairId: 0, rarity: 'consumer' },
    { id: 2, x: 60, y: 0, name: 'A', flipped: false, matched: false, pairId: 0, rarity: 'consumer' },
    { id: 3, x: 0, y: 60, name: 'B', flipped: false, matched: false, pairId: 1, rarity: 'consumer' },
  ]);

  incrementMovesMock.mockClear();
  incrementMatchMock.mockClear();
  incrementMismatchMock.mockClear();
  setGameOverMock.mockClear();
  onMatch.mockReset();
  onMismatch.mockReset();
  onGameOver.mockReset();
});

describe('useTileInteractions', () => {
  it('ignores click if blocked or game over', async () => {
    const { handleClick } = useTileInteractions(canvasRef, tiles, mouseX, mouseY, hoveredTileId, { onGameOver, onMatch, onMismatch }, tileSize);
    await handleClick(new MouseEvent('click'));
    expect(incrementMovesMock).not.toHaveBeenCalled();
    const hook = useTileInteractions(canvasRef, tiles, mouseX, mouseY, hoveredTileId, { onGameOver, onMatch, onMismatch }, tileSize);
    vi.spyOn(hook, 'isGameOver').mockReturnValue(true);
    await hook.handleClick(new MouseEvent('click'));
    expect(incrementMovesMock).not.toHaveBeenCalled();
  });

  it('ignores click if tile does not exist or is already discovered', async () => {
    const { handleClick } = useTileInteractions(canvasRef, tiles, mouseX, mouseY, hoveredTileId, { onGameOver, onMatch, onMismatch }, tileSize);
    await handleClick(new MouseEvent('click', { clientX: 500, clientY: 500 }));
    expect(incrementMovesMock).not.toHaveBeenCalled();
    tiles.value[0].flipped = true;
    await handleClick(new MouseEvent('click', { clientX: 10, clientY: 10 }));
    expect(incrementMovesMock).not.toHaveBeenCalled();
  });

  it('correctly performs click and flip animation, incrementMoves', async () => {
    const { handleClick } = useTileInteractions(canvasRef, tiles, mouseX, mouseY, hoveredTileId, { onGameOver, onMatch, onMismatch }, tileSize);
    await handleClick(new MouseEvent('click', { clientX: 10, clientY: 10 }));
    expect(animateFlip).toHaveBeenCalled();
    expect(tiles.value[0].flipped).toBe(true);
    expect(incrementMovesMock).not.toHaveBeenCalled();
  });

  it('match – calls handleMatchPair, onMatch and onGameOver', async () => {
    const { handleClick } = useTileInteractions(canvasRef, tiles, mouseX, mouseY, hoveredTileId, { onGameOver, onMatch, onMismatch }, tileSize);
    await handleClick(new MouseEvent('click', { clientX: 10, clientY: 10 }));
    await handleClick(new MouseEvent('click', { clientX: 65, clientY: 10 }));
    expect(incrementMovesMock).toHaveBeenCalled();
    expect(handleMatchPair).toHaveBeenCalled();
    expect(onMatch).toHaveBeenCalled();
  });

  it('mismatch – calls handleMismatchPair, onMismatch', async () => {
    const { handleClick } = useTileInteractions(canvasRef, tiles, mouseX, mouseY, hoveredTileId, { onGameOver, onMatch, onMismatch }, tileSize);
    await handleClick(new MouseEvent('click', { clientX: 10, clientY: 10 }));
    await handleClick(new MouseEvent('click', { clientX: 10, clientY: 65 }));
    expect(handleMismatchPair).toHaveBeenCalled();
    expect(onMismatch).toHaveBeenCalled();
  });

  it('resetInteractions and isGameOver work correctly', () => {
    const { resetInteractions, isGameOver } = useTileInteractions(
      canvasRef,
      tiles,
      mouseX,
      mouseY,
      hoveredTileId,
      { onGameOver, onMatch, onMismatch },
      tileSize
    );
    expect(isGameOver()).toBe(false);
    resetInteractions();
    expect(isGameOver()).toBe(false);
    expect(setGameOverMock).toHaveBeenCalledWith(false);
  });
});
