import { rarities } from '@/components/GameCanvas/GameCanvas.const';
import type { Rarity } from '@/components/GameCanvas/GameCanvas.types';

export const getRandomRarity = (): Rarity => {
  const index = Math.floor(Math.random() * rarities.length);
  return rarities[index];
};
