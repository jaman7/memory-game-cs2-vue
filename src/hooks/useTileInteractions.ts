import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { animateFlip } from '@/shared/utils/animationUtils';
import { drawBoard } from '@/shared/utils/canvasRenderer';
import { handleMatchPair } from '@/shared/utils/handlers/handleMatchPair';
import { handleMismatchPair } from '@/shared/utils/handlers/handleMismatchPair';
import { useGameStore } from '@/stores/useGameStore';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { useClickLock } from './useClickLock';
import { useGameOverChecker } from './useGameOverChecker';
import { useSoundEffects } from './useSoundEffects';
import { useTileEngine } from './useTileEngine';

interface TileInteractionCallbacks {
  onGameOver: () => void;
  onMatch?: (a: Tile, b: Tile) => void;
  onMismatch?: (a: Tile, b: Tile) => void;
}

export function useTileInteractions(
  canvasRef: Ref<HTMLCanvasElement | null>,
  tiles: Ref<Tile[]>,
  mouseX: Ref<number>,
  mouseY: Ref<number>,
  hoveredTileId: Ref<number | null>,
  callbacks: TileInteractionCallbacks,
  tileSize: Ref<number>
) {
  const { onGameOver, onMatch, onMismatch } = callbacks;

  const flippedTiles = ref<Tile[]>([]);
  const gameOver = ref(false);
  const engine = useTileEngine(tiles, tileSize);
  const { playFlip, playMatch, playFail, playWin } = useSoundEffects();
  const { isLocked, lock, unlock } = useClickLock();
  const { checkIfGameOver } = useGameOverChecker(tiles);
  const gameStore = useGameStore();

  async function flipAndRender(tile: Tile, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    await animateFlip(tile, canvas, tileSize.value, { reverse: true });
    tile.flipped = true;
    flippedTiles.value.push(tile);
    drawBoard(ctx, canvas, tiles.value, { x: mouseX.value, y: mouseY.value }, hoveredTileId.value, tileSize.value);
    await playFlip();
  }

  async function handleClick(e: MouseEvent | TouchEvent) {
    if (isLocked() || gameOver.value) return;

    const canvas = canvasRef.value;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e instanceof TouchEvent ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e instanceof TouchEvent ? e.changedTouches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const tile = engine.getTileAt(x, y);
    if (!tile || tile.flipped || tile.matched || flippedTiles.value.length >= 2) return;

    lock();

    await flipAndRender(tile, canvas, ctx);

    if (flippedTiles.value.length === 2) {
      gameStore.incrementMoves();
      const [a, b] = flippedTiles.value;

      if (engine.isMatchByName(a, b)) {
        await handleMatchPair(a, b, {
          playMatch,
          checkIfGameOver,
          playWin,
          onGameOver,
          onMatch,
          setGameOver: (v) => (gameOver.value = v),
          unlock,
        });
        flippedTiles.value = [];
      } else {
        await handleMismatchPair(a, b, {
          playFail,
          drawBoard: () => {
            drawBoard(ctx, canvas, tiles.value, { x: mouseX.value, y: mouseY.value }, hoveredTileId.value, tileSize.value);
          },
          onMismatch,
          unlock,
        });
        flippedTiles.value = [];
      }
    } else {
      unlock();
    }
  }

  function resetInteractions() {
    flippedTiles.value = [];
    unlock();
    gameOver.value = false;
    gameStore.setGameOver(false);
  }

  function isGameOver() {
    return gameOver.value;
  }

  return {
    handleClick,
    resetInteractions,
    isGameOver,
  };
}
