// zakładamy takie utilsy
import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { generateShuffledTiles } from '@/shared/utils/generateTiles';
import { onMounted, ref } from 'vue';

export function useDemoGame(onChange?: () => void) {
  const tiles = ref<Tile[]>([]);
  let difficulty = 0;

  const flipTwoTiles = async () => {
    const hidden = tiles.value.filter((t) => !t.flipped && !t.matched);
    if (hidden.length < 2) return;

    const [first, second] = hidden.sort(() => 0.5 - Math.random()).slice(0, 2);
    first.flipped = true;
    second.flipped = true;

    await new Promise((r) => setTimeout(r, 1000));

    if (first.name === second.name) {
      first.matched = true;
      second.matched = true;
    } else {
      first.flipped = false;
      second.flipped = false;
    }
  };

  const autoplay = async () => {
    difficulty = difficulty + 1;
    if (difficulty > 3) difficulty = 1;
    onChange?.();

    while (tiles.value.some((t) => !t.matched)) {
      await flipTwoTiles();
      await new Promise((r) => setTimeout(r, 600));
    }

    await new Promise((r) => setTimeout(r, 1000));

    tiles.value = generateShuffledTiles('demo', difficulty);
    onChange?.();
    autoplay();
  };

  onMounted(() => {
    tiles.value = generateShuffledTiles('demo', 1);
    autoplay();
  });

  return { tiles };
}
