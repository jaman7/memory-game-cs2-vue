import { generateShuffledTiles } from '@/shared/utils/generateTiles';
import { preloadImages } from '@/shared/utils/imageCache';
import { isDifficultyType } from '@/shared/utils/isDifficultyType';
import { ref } from 'vue';

export function useGameStart() {
  const isLoading = ref(false);
  const seed = ref('');
  const difficulty = ref<number>(1);

  async function startGame(payload: { seed: string; difficulty: number }) {
    localStorage.removeItem('memory-game-state');
    seed.value = payload.seed || Date.now().toString();

    if (isDifficultyType(payload.difficulty)) {
      difficulty.value = payload.difficulty;
    } else {
      console.error('Invalid difficulty type:', payload.difficulty);
    }

    const tiles = generateShuffledTiles(seed.value, difficulty.value);
    const imagesToPreload = tiles.map((t) => t.imagePath!).filter(Boolean);
    preloadImages(imagesToPreload);

    isLoading.value = true;

    await Promise.all(
      imagesToPreload.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            if (img.complete) resolve(true);
            else img.onload = () => resolve(true);
          })
      )
    );

    isLoading.value = false;
    return {
      seed: seed.value,
      difficulty: difficulty.value,
    };
  }

  return {
    isLoading,
    startGame,
  };
}
