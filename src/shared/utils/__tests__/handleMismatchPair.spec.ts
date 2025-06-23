import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { handleMismatchPair } from '@/shared/utils/handlers/handleMismatchPair';
import { describe, expect, it, vi } from 'vitest';

const incrementMismatchMock = vi.fn();

vi.mock('@/stores/useGameStore', () => ({
  useGameStore: () => ({
    incrementMismatch: incrementMismatchMock,
  }),
}));

describe('handleMismatchPair', () => {
  it('should play fail sound, call onMismatch, unflip tiles, draw board and increment mismatch', async () => {
    vi.useFakeTimers();

    const a: Tile = {
      id: 1,
      name: 'tile1',
      pairId: 1,
      rarity: 'consumer',
      matched: false,
      flipped: true,
      x: 0,
      y: 0,
    };

    const b: Tile = {
      id: 2,
      name: 'tile2',
      pairId: 1,
      rarity: 'consumer',
      matched: false,
      flipped: true,
      x: 0,
      y: 0,
    };

    const opts = {
      playFail: vi.fn().mockResolvedValue(undefined),
      drawBoard: vi.fn(),
      onMismatch: vi.fn(),
      unlock: vi.fn(),
    };

    const promise = handleMismatchPair(a, b, opts);

    expect(opts.playFail).toHaveBeenCalled();

    // fast-forward przez 1000ms (czekanie na unflip)
    await vi.runOnlyPendingTimersAsync();
    await promise;

    expect(opts.onMismatch).toHaveBeenCalledWith(a, b);
    expect(a.flipped).toBe(false);
    expect(b.flipped).toBe(false);
    expect(opts.drawBoard).toHaveBeenCalled();
    expect(opts.unlock).toHaveBeenCalled();
    expect(incrementMismatchMock).toHaveBeenCalledWith(a, b);

    vi.useRealTimers();
  });
});
