import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { animateFlip } from '@/shared/utils/animationUtils';
import { drawBoard } from '@/shared/utils/canvasRenderer';
import { useGameStore } from '@/stores/useGameStore';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { useClickLock } from './useClickLock';
import { useGameOverChecker } from './useGameOverChecker';
import { useSoundEffects } from './useSoundEffects';
import { useTileEngine } from './useTileEngine';

export function useTileInteractions(
  canvasRef: Ref<HTMLCanvasElement | null>,
  tiles: Ref<Tile[]>,
  mouseX: Ref<number>,
  mouseY: Ref<number>,
  hoveredTileId: Ref<number | null>,
  onGameOver: () => void,
  tileSize: Ref<number>
) {
  const flippedTiles = ref<Tile[]>([]);
  const gameOver = ref(false);
  const engine = useTileEngine(tiles, tileSize);
  const { playFlip, playMatch, playFail, playWin } = useSoundEffects();
  const { isLocked, lock, unlock } = useClickLock();
  const { checkIfGameOver } = useGameOverChecker(tiles);
  const gameStore = useGameStore();

  async function handleClick(e: MouseEvent) {
    if (isLocked() || gameOver.value) return;

    const canvas = canvasRef.value;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.offsetX;
    const y = e.clientY - rect.top;

    const tile = engine.getTileAt(x, y);
    if (!tile || tile.flipped || tile.matched || flippedTiles.value.length >= 2) return;

    lock();

    await animateFlip(tile, canvas, tileSize.value, { reverse: true });
    tile.flipped = true;
    flippedTiles.value.push(tile);
    drawBoard(ctx, canvas, tiles.value, { x: mouseX.value, y: mouseY.value }, hoveredTileId.value, tileSize.value);
    await playFlip();

    if (flippedTiles.value.length === 2) {
      gameStore.incrementMoves();

      const [a, b] = flippedTiles.value;
      if (engine.isMatchByName(a, b)) {
        a.matched = true;
        b.matched = true;
        a.haloAngle = 0;
        b.haloAngle = 0;
        flippedTiles.value = [];
        await playMatch();

        if (checkIfGameOver()) {
          await playWin();
          gameOver.value = true;
          onGameOver();
          gameStore?.setGameOver(true);
        }

        unlock();
      } else {
        await playFail();
        await new Promise((res) => setTimeout(res, 1000));
        a.flipped = false;
        b.flipped = false;
        flippedTiles.value = [];
        drawBoard(ctx, canvas, tiles.value, { x: mouseX.value, y: mouseY.value }, hoveredTileId.value, tileSize.value);
        unlock();
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
