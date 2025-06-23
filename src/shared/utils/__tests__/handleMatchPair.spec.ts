import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { handleMatchPair } from '@/shared/utils/handlers/handleMatchPair';
import { describe, expect, it, vi } from 'vitest';

const incrementMatchMock = vi.fn();

vi.mock('@/stores/useGameStore', () => ({
  useGameStore: () => ({
    incrementMatch: incrementMatchMock,
  }),
}));

describe('handleMatchPair', () => {
  it('should mark tiles as matched, call playMatch and increment match, and handle game over flow', async () => {
    const a: Tile = {
      id: 1,
      name: 'tile1',
      pairId: 1,
      rarity: 'consumer',
      matched: false,
      flipped: false,
      x: 0,
      y: 0,
    };

    const b: Tile = {
      id: 2,
      name: 'tile1',
      pairId: 1,
      rarity: 'consumer',
      matched: false,
      flipped: false,
      x: 0,
      y: 0,
    };

    const opts = {
      playMatch: vi.fn().mockResolvedValue(undefined),
      checkIfGameOver: vi.fn().mockReturnValue(true),
      playWin: vi.fn().mockResolvedValue(undefined),
      onGameOver: vi.fn(),
      onMatch: vi.fn(),
      setGameOver: vi.fn(),
      unlock: vi.fn(),
    };

    await handleMatchPair(a, b, opts);

    expect(a.matched).toBe(true);
    expect(b.matched).toBe(true);
    expect(a.haloAngle).toBe(0);
    expect(b.haloAngle).toBe(0);
    expect(opts.playMatch).toHaveBeenCalled();
    expect(opts.onMatch).toHaveBeenCalledWith(a, b);
    expect(incrementMatchMock).toHaveBeenCalledWith(a, b);
    expect(opts.checkIfGameOver).toHaveBeenCalled();
    expect(opts.playWin).toHaveBeenCalled();
    expect(opts.setGameOver).toHaveBeenCalledWith(true);
    expect(opts.onGameOver).toHaveBeenCalled();
    expect(opts.unlock).toHaveBeenCalled();
  });
});
