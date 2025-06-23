import type { GameState } from '@/components/GameCanvas/GameCanvas.types';
import { useGameStateStorage } from '@/hooks/useGameStateStorage';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useGameStateStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const sampleState: GameState = {
    dateStart: '2025-06-22T12:00:00Z',
    tiles: [{ id: 1, name: 'Test', pairId: 0, flipped: false, matched: false, x: 0, y: 0, rarity: 'consumer' }],
    elapsedSeconds: 30,
    moves: 5,
    seed: 'abc',
    difficulty: 2,
    matchCount: 3,
    mismatchCount: 2,
    matchedPairs: [],
  };

  it('initial gameState is null when nothing in storage', () => {
    const { gameState } = useGameStateStorage();
    expect(gameState.value).toBeNull();
  });

  it('save() stores provided state correctly', () => {
    const { gameState, save } = useGameStateStorage();
    save(sampleState);
    expect(gameState.value).toEqual(sampleState);
  });

  it('load() returns saved state', () => {
    const { save, load } = useGameStateStorage();
    save(sampleState);
    expect(load()).toEqual(sampleState);
  });

  it('clear() resets state to null and clears storage', () => {
    const { gameState, save, clear } = useGameStateStorage();
    save(sampleState);
    clear();
    expect(gameState.value).toBeNull();
    expect(localStorage.getItem('memory-game-state')).toBeNull();
  });
});
