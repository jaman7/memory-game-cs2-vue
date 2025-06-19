import { weapons } from '@/components/GameCanvas/GameCanvas.const';
import type { Skin, Tile } from '@/components/GameCanvas/GameCanvas.types';
import { getRandomRarity } from './getRandomRarity';
import { preloadImages } from './imageCache';

export const skins: Skin[] =
  weapons?.map((name, index) => ({
    id: index,
    name: name?.toUpperCase(),
    imagePath: `/images/weapons/${name.replace(/ /g, '_')}.png`,
    rarity: getRandomRarity(),
  })) ?? [];

preloadImages(skins.map((skin) => skin.imagePath));

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function shuffleArray<T>(array: T[], seed: string): T[] {
  const rng = xmur3(seed);
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const generateShuffledTiles = (seed: string, difficulty: number): Tile[] => {
  const tiles: Tile[] = [];
  const numPairs = difficulty === 1 ? 6 : difficulty === 2 ? 10 : 15;

  const selectedSkins = shuffleArray(skins, seed).slice(0, numPairs);

  selectedSkins.forEach((skin, index) => {
    const pairId = index;
    for (let i = 0; i < 2; i++) {
      tiles.push({
        id: tiles.length,
        name: skin.name,
        pairId,
        flipped: false,
        matched: false,
        x: 0,
        y: 0,
        rarity: skin.rarity,
        imagePath: skin.imagePath,
      });
    }
  });

  const shuffled = shuffleArray(tiles, seed);

  const cols = 6;
  const spacing = 110;
  shuffled.forEach((tile, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    tile.x = col * spacing + 20;
    tile.y = row * spacing + 20;
  });

  return shuffled;
};
