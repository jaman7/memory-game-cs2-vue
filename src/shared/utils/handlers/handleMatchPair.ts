import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { useGameStore } from '@/stores/useGameStore';

interface HandleMatchPairOptions {
  playMatch: () => Promise<void>;
  checkIfGameOver: () => boolean;
  playWin: () => Promise<void>;
  onGameOver: () => void;
  onMatch?: (a: Tile, b: Tile) => void;
  setGameOver: (value: boolean) => void;
  unlock: () => void;
}

export async function handleMatchPair(a: Tile, b: Tile, opts: HandleMatchPairOptions) {
  a.matched = true;
  b.matched = true;
  a.haloAngle = 0;
  b.haloAngle = 0;

  if (opts.onMatch) opts.onMatch(a, b);

  await opts.playMatch();

  useGameStore().incrementMatch(a, b);

  if (opts.checkIfGameOver()) {
    await opts.playWin();
    opts.setGameOver(true);
    opts.onGameOver();
  }

  opts.unlock();
}
