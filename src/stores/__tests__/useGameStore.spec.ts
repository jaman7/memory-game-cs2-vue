import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { useGameStore } from '@/stores/useGameStore';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/utils/generateTiles', () => ({
  generateShuffledTiles: vi.fn(() => [{ id: 1, name: 'A', pairId: 0, rarity: 'consumer', flipped: false, matched: false, x: 0, y: 0 }]),
}));

vi.mock('@/shared/utils/isDifficultyType', () => ({
  isDifficultyType: vi.fn((d: number) => d >= 1 && d <= 3),
}));

vi.mock('@/shared/utils/timeStamp', () => ({
  getTimeStamp: vi.fn(() => 12345),
}));

describe('useGameStore', () => {
  let store: ReturnType<typeof useGameStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useGameStore();
  });

  it('startGame initializes properly', () => {
    const payload = { seed: 'seed', difficulty: 2 };
    store.startGame(payload);

    expect(store.seed).toBe('seed');
    expect(store.difficulty).toBe(2);
    expect(store.tiles).toHaveLength(1);
    expect(store.moves).toBe(0);
    expect(store.elapsed).toBe(0);
    expect(store.gameStarted).toBe(true);
    expect(store.gameOver).toBe(false);
    expect(store.matchCount).toBe(0);
    expect(store.mismatchCount).toBe(0);
    expect(store.matchedPairs).toEqual([]);
    expect(store.dateStart).toBeDefined();
  });

  it('incrementMatch updates matchCount and matchedPairs', () => {
    const a = { id: 1, pairId: 0, rarity: 'consumer', flipped: false, matched: false, x: 0, y: 0 } as Tile;
    const b = { id: 2, pairId: 0, rarity: 'consumer', flipped: false, matched: false, x: 0, y: 0 } as Tile;
    store.startGame({ seed: 's', difficulty: 1 });

    store.incrementMatch(a, b);

    expect(store.matchCount).toBe(1);
    expect(store.matchedPairs).toHaveLength(1);
    const rec = store.matchedPairs[0];
    expect(rec.result).toBe('match');
    expect(rec.timestamp).toBe(12345);
  });

  it('incrementMismatch updates mismatchCount and matchedPairs', () => {
    const a = { id: 1, pairId: 0, rarity: 'consumer', flipped: false, matched: false, x: 0, y: 0 } as Tile;
    const b = { id: 2, pairId: 0, rarity: 'consumer', flipped: false, matched: false, x: 0, y: 0 } as Tile;

    store.incrementMismatch(a, b);
    expect(store.mismatchCount).toBe(1);
    expect(store.matchedPairs).toHaveLength(1);
    expect(store.matchedPairs[0].result).toBe('mismatch');
  });

  it('resetStats clears matches and mismatches', () => {
    store.incrementMatch({} as any, {} as any);
    store.incrementMismatch({} as any, {} as any);
    expect(store.matchCount).toBe(1);
    expect(store.mismatchCount).toBe(1);

    store.resetStats();
    expect(store.matchCount).toBe(0);
    expect(store.mismatchCount).toBe(0);
    expect(store.matchedPairs).toEqual([]);
  });

  it('restartGame regenerates tiles but keeps seed and difficulty', () => {
    store.startGame({ seed: 'x', difficulty: 3 });
    const firstTiles = store.tiles.map((t) => t.id);
    store.restartGame();
    expect(store.seed).toBe('x');
    expect(store.tiles).not.toEqual(firstTiles);
  });

  it('restoreGame sets state', () => {
    const state = { dateStart: 'a', tiles: [], elapsedSeconds: 5, moves: 2, seed: 'y', difficulty: 1, matchCount: 2, mismatchCount: 3, matchedPairs: [] };
    store.restoreGame(state);
    expect(store.dateStart).toBe('a');
    expect(store.elapsed).toBe(5);
    expect(store.moves).toBe(2);
    expect(store.seed).toBe('y');
  });

  it('toggleDevPanel and toggleSidebar work', () => {
    const prevDev = store.devPanelVisible;
    const prevSidebar = store.sidebarVisible;
    store.toggleDevPanel();
    store.toggleSidebar();
    expect(store.devPanelVisible).toBe(!prevDev);
    expect(store.sidebarVisible).toBe(!prevSidebar);
    store.toggleSidebar(false);
    expect(store.sidebarVisible).toBe(false);
  });
});
