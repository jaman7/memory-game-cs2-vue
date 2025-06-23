import { useGameStart } from '@/hooks/useGameStart';
import { preloadImagesWithAwait } from '@/shared/utils/imageCache';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/utils/generateTiles', () => ({
  generateShuffledTiles: vi.fn(() => [
    { id: 1, name: 'Tile1', rarity: 'consumer', pairId: 1, flipped: false, matched: false, x: 0, y: 0, imagePath: '/img1.png' },
    { id: 2, name: 'Tile2', rarity: 'consumer', pairId: 2, flipped: false, matched: false, x: 0, y: 0, imagePath: '/img2.png' },
  ]),
}));

vi.mock('@/shared/utils/imageCache', () => ({
  preloadImagesWithAwait: vi.fn(() => Promise.resolve()),
}));

vi.stubGlobal('localStorage', {
  removeItem: vi.fn(),
  getItem: vi.fn(),
  setItem: vi.fn(),
});

describe('useGameStart', () => {
  it('startGame loads tiles, preloads images, removes storage, and returns seed/difficulty', async () => {
    const { startGame, isLoading } = useGameStart();
    const result = await startGame({ seed: 'test-seed', difficulty: 1 });

    expect(localStorage.removeItem).toHaveBeenCalledWith('memory-game-state');
    expect(preloadImagesWithAwait).toHaveBeenCalledWith(['/img1.png', '/img2.png']);
    expect(isLoading.value).toBe(false);
    expect(result.seed).toBe('test-seed');
    expect(result.difficulty).toBe(1);
  });

  it('startGame uses fallback seed when none provided', async () => {
    const { startGame } = useGameStart();
    const result = await startGame({ seed: '', difficulty: 1 });
    expect(result.seed).not.toBe('');
  });

  it('startGame logs error and ignores invalid difficulty', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { startGame } = useGameStart();
    const result = await startGame({ seed: 'test', difficulty: 99 });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid difficulty type:', 99);
    consoleErrorSpy.mockRestore();
  });
});
