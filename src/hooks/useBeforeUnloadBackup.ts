import { useGamePersistence } from '@/hooks/useGamePersistence';
import { useGameStore } from '@/stores/useGameStore';
import { onMounted, onUnmounted } from 'vue';

export function useBeforeUnloadBackup() {
  const gameStore = useGameStore();
  const { saveState } = useGamePersistence(gameStore.seed, gameStore.difficulty);

  function handleUnload() {
    saveState(gameStore.gameState);
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
  });

  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleUnload);
    window.removeEventListener('pagehide', handleUnload);
  });
}
