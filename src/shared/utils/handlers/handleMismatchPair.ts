import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { useGameStore } from '@/stores/useGameStore';

interface HandleMismatchPairOptions {
  playFail: () => Promise<void>;
  drawBoard: () => void;
  onMismatch?: (a: Tile, b: Tile) => void;
  unlock: () => void;
}

export async function handleMismatchPair(a: Tile, b: Tile, opts: HandleMismatchPairOptions) {
  await opts.playFail();

  if (opts.onMismatch) opts.onMismatch(a, b);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  a.flipped = false;
  b.flipped = false;

  opts.drawBoard();

  opts.unlock();
  useGameStore().incrementMismatch(a, b);
}
