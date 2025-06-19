import type { GameHistoryEntry } from '@/components/GameCanvas/GameCanvas.types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const STORAGE_KEY = 'memory-game-history';

export const useGameHistoryStore = defineStore('gameHistory', () => {
  const history = ref<GameHistoryEntry[]>([]);

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      history.value = raw ? JSON.parse(raw) : [];
    } catch {
      history.value = [];
    }
  }

  function addEntry(entry: GameHistoryEntry) {
    history.value.unshift(entry);
    history.value = history.value.slice(0, 10);
    saveToStorage();
  }

  function clearHistory() {
    history.value = [];
    saveToStorage();
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value));
  }

  const stats = computed(() => {
    const games = history.value.length;
    const avgTime = games ? Math.round(history.value.reduce((a, e) => a + e.time, 0) / games) : 0;
    const avgMoves = games ? Math.round(history.value.reduce((a, e) => a + e.moves, 0) / games) : 0;
    return { games, avgTime, avgMoves };
  });

  return {
    history,
    addEntry,
    clearHistory,
    loadFromStorage,
    stats,
  };
});
