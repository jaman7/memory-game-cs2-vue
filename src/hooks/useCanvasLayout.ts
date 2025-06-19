import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import type { Ref } from 'vue';

export function useCanvasLayout(canvasRef: Ref<HTMLCanvasElement | null>, tiles: Ref<Tile[]>, currentTileSize: Ref<number>) {
  function layoutCanvas(width: number, height: number) {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function applyTileLayout() {
    const container = canvasRef.value?.parentElement;
    if (!container) return;

    const tileCount = tiles.value.length;
    const maxCols = 6;
    const spacing = 10;
    const padding = 20;

    const cols = Math.min(maxCols, Math.ceil(Math.sqrt(tileCount)));
    const rows = Math.ceil(tileCount / cols);

    const maxWidth = container.clientWidth;
    const maxHeight = window.innerHeight - 92 - 16 - 2;

    const tileSizeByWidth = Math.floor((maxWidth - padding * 2 - spacing * (cols - 1)) / cols);
    const tileSizeByHeight = Math.floor((maxHeight - padding * 2 - spacing * (rows - 1)) / rows);
    const tileSize = Math.min(tileSizeByWidth, tileSizeByHeight);

    currentTileSize.value = tileSize;

    const totalWidth = cols * tileSize + (cols - 1) * spacing + padding * 2;
    const totalHeight = rows * tileSize + (rows - 1) * spacing + padding * 2;

    tiles.value.forEach((tile, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      tile.x = col * (tileSize + spacing) + padding;
      tile.y = row * (tileSize + spacing) + padding;
    });

    layoutCanvas(totalWidth, totalHeight);
  }

  return {
    layoutCanvas,
    applyTileLayout,
  };
}
