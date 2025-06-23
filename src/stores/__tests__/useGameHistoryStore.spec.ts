import { useGameHistoryStore } from '@/stores/useGameHistoryStore';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useGameHistoryStore', () => {
  let store: ReturnType<typeof useGameHistoryStore>;

  const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      __store: store,
    };
  })();

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useGameHistoryStore();

    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
    });
    mockLocalStorage.clear();
  });

  it('adds entry and trims to 10', () => {
    for (let i = 0; i < 12; i++) {
      store.addEntry({ dateStart: '', dateEnd: '', time: i, moves: i, seed: '', difficulty: 1, matchCount: 0, mismatchCount: 0, matchedPairs: [] });
    }
    expect(store.history).toHaveLength(10);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('clears history and saves to storage', () => {
    store.addEntry({ dateStart: '', dateEnd: '', time: 10, moves: 5, seed: '', difficulty: 1, matchCount: 0, mismatchCount: 0, matchedPairs: [] });
    store.clearHistory();
    expect(store.history).toEqual([]);
    expect(localStorage.setItem).toHaveBeenCalledWith(expect.any(String), JSON.stringify([]));
  });

  it('loads history from localStorage', () => {
    const mockData = [{ dateStart: '', dateEnd: '', time: 20, moves: 10, seed: '', difficulty: 1, matchCount: 0, mismatchCount: 0, matchedPairs: [] }];
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValueOnce(JSON.stringify(mockData));

    store.loadFromStorage();
    expect(store.history).toEqual(mockData);
  });

  it('computes stats correctly', () => {
    store.history = [
      { dateStart: '', dateEnd: '', time: 20, moves: 10, seed: '', difficulty: 1, matchCount: 0, mismatchCount: 0, matchedPairs: [] },
      { dateStart: '', dateEnd: '', time: 10, moves: 5, seed: '', difficulty: 1, matchCount: 0, mismatchCount: 0, matchedPairs: [] },
    ];
    expect(store.stats).toEqual({ games: 2, avgTime: 15, avgMoves: 8 });
  });
});
