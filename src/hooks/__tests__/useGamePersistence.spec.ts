import type { GameState } from '@/components/GameCanvas/GameCanvas.types';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import * as gameStateStorageModule from '@/hooks/useGameStateStorage';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

vi.mock('@/hooks/useGameStateStorage');

describe('useGamePersistence', () => {
  const mockSave = vi.fn();
  const mockLoad = vi.fn();
  const mockClear = vi.fn();

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

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(gameStateStorageModule.useGameStateStorage).mockReturnValue({
      gameState: ref({
        dateStart: null,
        tiles: [],
        elapsedSeconds: 0,
        moves: 0,
        seed: '',
        difficulty: 0,
        matchCount: 0,
        mismatchCount: 0,
        matchedPairs: [],
      }),
      save: mockSave,
      load: mockLoad,
      clear: mockClear,
    });
  });

  it('saveState calls save with enriched game state', () => {
    const { saveState } = useGamePersistence('abc', 2);
    saveState(sampleState);
    expect(mockSave).toHaveBeenCalledWith(expect.objectContaining(sampleState));
  });

  it('loadState returns loaded state', () => {
    const { loadState } = useGamePersistence('abc', 2);
    mockLoad.mockReturnValue(sampleState);
    expect(loadState()).toEqual(sampleState);
  });

  it('clearState calls clear', () => {
    const { clearState } = useGamePersistence('abc', 2);
    clearState();
    expect(mockClear).toHaveBeenCalled();
  });
});
