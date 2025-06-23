import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { useTileEngine } from '@/hooks/useTileEngine';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

describe('useTileEngine', () => {
  const size = 50;
  const tilesRef = ref<Tile[]>([
    { id: 1, name: 'A', x: 10, y: 10, flipped: false, matched: false, pairId: 0, rarity: 'consumer', imagePath: '', color: undefined, value: undefined },
    { id: 2, name: 'B', x: 100, y: 10, flipped: false, matched: false, pairId: 1, rarity: 'consumer', imagePath: '', color: undefined, value: undefined },
    { id: 3, name: 'A', x: 10, y: 100, flipped: true, matched: false, pairId: 0, rarity: 'consumer', imagePath: '', color: undefined, value: undefined },
    { id: 4, name: 'A', x: 100, y: 100, flipped: false, matched: true, pairId: 0, rarity: 'consumer', imagePath: '', color: undefined, value: undefined },
  ]);
  const tileSize = ref(size);
  const { getTileAt, isMatchByName } = useTileEngine(tilesRef, tileSize);

  describe('getTileAt', () => {
    it('returns tile when coordinates match and tile is not flipped/matched', () => {
      const tile = getTileAt(20, 20);
      expect(tile).not.toBeNull();
      expect(tile?.id).toBe(1);
    });

    it('returns null if tile is flipped', () => {
      const tile = getTileAt(15, 105);
      expect(tile).toBeNull();
    });

    it('returns null if tile is already matched', () => {
      const tile = getTileAt(110, 110);
      expect(tile).toBeNull();
    });

    it('returns null when clicking outside any tile', () => {
      const tile = getTileAt(500, 500);
      expect(tile).toBeNull();
    });
  });

  describe('isMatchByName', () => {
    it('returns true when tile names match', () => {
      const tA = tilesRef.value[0];
      const tC = tilesRef.value[2];
      expect(isMatchByName(tA, tC)).toBe(true);
    });

    it('returns false when tile names do not match', () => {
      const tA = tilesRef.value[0];
      const tB = tilesRef.value[1];
      expect(isMatchByName(tA, tB)).toBe(false);
    });
  });
});
