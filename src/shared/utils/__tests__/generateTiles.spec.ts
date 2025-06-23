import { rarities } from '@/components/GameCanvas/GameCanvas.const';
import { generateShuffledTiles } from '@/shared/utils/generateTiles';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/utils/imageCache', () => ({
  preloadImagesSync: vi.fn(),
}));

vi.mock('@/shared/utils/getRandomRarity', () => ({
  getRandomRarity: vi.fn(() => rarities[0]),
}));

describe('generateShuffledTiles', () => {
  it('should generate correct number of tiles and assign positions', () => {
    const seed = 'test-seed';
    const difficulty = 2;

    const tiles = generateShuffledTiles(seed, difficulty);

    expect(tiles.length).toBe(20);
    for (const tile of tiles) {
      expect(tile.name).toBeDefined();
      expect(tile.imagePath).toMatch(/^\/images\/weapons\/.*\.png$/);
      expect(tile.rarity).toBe(rarities[0]);
      expect(typeof tile.x).toBe('number');
      expect(typeof tile.y).toBe('number');
    }
  });

  it('should return same tiles for same seed and difficulty', () => {
    const tiles1 = generateShuffledTiles('seed-xyz', 1);
    const tiles2 = generateShuffledTiles('seed-xyz', 1);

    expect(tiles1).toEqual(tiles2);
  });
});
