import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { useGameOverChecker } from '@/hooks/useGameOverChecker';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

describe('useGameOverChecker', () => {
  it('returns true if all tiles are matched', () => {
    const tiles = ref<Tile[]>([
      { id: 1, name: 'A', pairId: 1, flipped: false, matched: true, x: 0, y: 0, rarity: 'covert' },
      { id: 2, name: 'B', pairId: 2, flipped: false, matched: true, x: 100, y: 0, rarity: 'classified' },
    ]);
    const { checkIfGameOver } = useGameOverChecker(tiles);
    expect(checkIfGameOver()).toBe(true);
  });

  it('returns false if any tile is not matched', () => {
    const tiles = ref<Tile[]>([
      { id: 1, name: 'A', pairId: 1, flipped: false, matched: true, x: 0, y: 0, rarity: 'covert' },
      { id: 2, name: 'B', pairId: 2, flipped: false, matched: false, x: 100, y: 0, rarity: 'classified' },
    ]);
    const { checkIfGameOver } = useGameOverChecker(tiles);
    expect(checkIfGameOver()).toBe(false);
  });

  it('returns false if tile list is empty', () => {
    const tiles = ref<Tile[]>([]);
    const { checkIfGameOver } = useGameOverChecker(tiles);
    expect(checkIfGameOver()).toBe(false);
  });
});
