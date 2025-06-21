import { sounds } from '@/shared/sounds/sounds';

export function useSoundEffects() {
  return {
    playFlip: () => {
      sounds.flip.play();
      return Promise.resolve();
    },
    playMatch: () => {
      sounds.match.play();
      return Promise.resolve();
    },
    playFail: () => {
      sounds.fail.play();
      return Promise.resolve();
    },
    playWin: () => {
      sounds.win.play();
      return Promise.resolve();
    },
  };
}
