import { rarities } from '@/components/GameCanvas/GameCanvas.const';
import { getRandomRarity } from '@/shared/utils/getRandomRarity';
import { describe, expect, it } from 'vitest';

describe('getRandomRarity', () => {
  it('should return a valid rarity', () => {
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
      const rarity = getRandomRarity();
      expect(rarities).toContain(rarity);
    }
  });

  it('should include all rarities after multiple calls', () => {
    const foundRarities = new Set();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      foundRarities.add(getRandomRarity());
    }

    rarities.forEach((rarity) => {
      expect(foundRarities.has(rarity)).toBe(true);
    });
  });
});
