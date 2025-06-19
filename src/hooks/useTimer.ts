import { ref } from 'vue';

import { useGameStore } from '@/stores/useGameStore';

export function useTimer(onBackup?: () => void) {
  const elapsed = ref(0);
  let interval: number | null = null;
  const gameStore = useGameStore();

  function start() {
    if (interval) return;
    interval = window.setInterval(() => {
      gameStore.incrementTime();
      onBackup?.();
    }, 1000);
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    stop();
    gameStore.elapsed = 0;
  }

  return {
    elapsed,
    start,
    stop,
    reset,
  };
}
