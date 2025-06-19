import { sounds } from '@/shared/sounds/sounds';

export function useSoundEffects() {
  function playFlip() {
    sounds.flip?.play?.();
  }

  function playMatch() {
    sounds.match?.play?.();
  }

  function playFail() {
    sounds.fail?.play?.();
  }

  function playWin() {
    sounds.win?.play?.();
  }

  return {
    playFlip,
    playMatch,
    playFail,
    playWin,
  };
}
