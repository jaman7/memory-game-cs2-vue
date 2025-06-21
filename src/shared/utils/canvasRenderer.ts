import { colors, RarityBorders, RarityColors } from '@/components/GameCanvas/GameCanvas.const';
import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import { preloadedImages } from '@/shared/utils/imageCache';
import { drawRoundedRect } from './drawRoundedRect';

function getAnimatedStrokeGradient(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  angle: number,
  baseColor: string
): CanvasGradient {
  const radiusX = width / 2;
  const radiusY = height / 2;
  const cx = x + radiusX;
  const cy = y + radiusY;

  const offsetX = Math.cos(angle) * radiusX;
  const offsetY = Math.sin(angle) * radiusY;

  const gradient = ctx.createLinearGradient(cx - offsetX, cy - offsetY, cx + offsetX, cy + offsetY);

  gradient.addColorStop(0, baseColor);
  gradient.addColorStop(0.5, 'white');
  gradient.addColorStop(1, baseColor);

  return gradient;
}

function drawTileFrame(ctx: CanvasRenderingContext2D, tile: Tile, tileWidth: number, tileHeight: number, isHovered: boolean) {
  const baseColor = RarityBorders[tile.rarity];
  const angle = tile.matched && tile.haloAngle !== undefined ? tile.haloAngle : 0;

  if (tile.matched && tile.haloAngle !== undefined) {
    ctx.strokeStyle = getAnimatedStrokeGradient(ctx, tile.x, tile.y, tileWidth, tileHeight, angle, baseColor);
  } else {
    ctx.strokeStyle = baseColor;
  }

  ctx.lineWidth = isHovered ? 8 : 5;
  drawRoundedRect(ctx, tile.x + 1, tile.y + 1, tileWidth - 2, tileHeight - 2, 10);
  ctx.stroke();
}

export function drawTileWithFlip(ctx: CanvasRenderingContext2D, tile: Tile, progress: number, size = 100) {
  const tileWidth = size;
  const tileHeight = size;

  const centerX = tile.x + tileWidth / 2;
  const centerY = tile.y + tileHeight / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(1 - 2 * Math.abs(progress - 0.5), 1);
  ctx.translate(-centerX, -centerY);

  if (tile.flipped || tile.matched) {
    const gradient = ctx.createLinearGradient(tile.x, tile.y, tile.x + tileWidth, tile.y + tileHeight);
    gradient.addColorStop(0, RarityColors[tile.rarity]);
    gradient.addColorStop(1, colors.darkBlue);
    ctx.fillStyle = gradient;
    drawRoundedRect(ctx, tile.x, tile.y, tileWidth, tileHeight, 10);
    ctx.fill();

    if (tile.imagePath && progress > 0.5) {
      const img = preloadedImages[tile.imagePath];
      if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        ctx.drawImage(img, tile.x + size * 0.1, tile.y + size * 0.1, size * 0.8, size * 0.8);
      }
    }

    ctx.strokeStyle = RarityBorders[tile.rarity];

    drawTileFrame(ctx, tile, tileWidth, tileHeight, false);

    ctx.fillStyle = colors.tonedBlack;
    const textSize = Math.floor(size * 0.07);
    ctx.font = `${textSize}px Roboto`;
    ctx.fillText(tile.name.split('|')[0], tile.x + size * 0.05, tile.y + size - size * 0.05);
  } else {
    ctx.fillStyle = colors.darkBlue;
    drawRoundedRect(ctx, tile.x, tile.y, tileWidth, tileHeight, 10);
    ctx.fill();
  }

  ctx.restore();
}

export function drawBoard(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  tiles: Tile[],
  mouse: { x: number; y: number },
  hoveredId: number | null,
  tileSize = 100,
  fadeStartTime?: Ref<number | null>
) {
  const now = Date.now();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = colors.lightGray;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  tiles.forEach((tile) => {
    const centerX = tile.x + tileSize / 2;
    const centerY = tile.y + tileSize / 2;
    const isHovered = hoveredId === tile.id;

    let alpha = 1;
    if (fadeStartTime?.value) {
      const elapsed = now - fadeStartTime.value;
      const fadeInDuration = 600; // ms
      alpha = Math.min(1, elapsed / fadeInDuration);
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(centerX, centerY);
    ctx.translate(-centerX, -centerY);

    if (isHovered) {
      ctx.shadowColor = colors.shadowColor;
      ctx.shadowBlur = 16;
    } else {
      ctx.shadowBlur = 0;
    }

    if (tile.matched || tile.flipped) {
      const gradient = ctx.createLinearGradient(tile.x, tile.y, tile.x + tileSize, tile.y + tileSize);
      gradient.addColorStop(0, RarityColors[tile.rarity]);
      gradient.addColorStop(1, colors.darkBlue);
      ctx.fillStyle = gradient;
      drawRoundedRect(ctx, tile.x, tile.y, tileSize, tileSize, 10);
      ctx.fill();

      const img = preloadedImages[tile.imagePath!];
      if (img && img.complete && img.naturalWidth > 0) {
        const offsetX = (mouse.x - centerX) * 0.02;
        const offsetY = (mouse.y - centerY) * 0.02;
        ctx.drawImage(img, tile.x + tileSize * 0.1 + offsetX, tile.y + tileSize * 0.1 + offsetY, tileSize * 0.8, tileSize * 0.8);
      }

      ctx.strokeStyle = RarityBorders[tile.rarity];
      drawTileFrame(ctx, tile, tileSize, tileSize, isHovered);

      ctx.fillStyle = colors.lightGray;
      const textSize = Math.floor(tileSize * 0.08);
      ctx.font = `${textSize}px Roboto`;
      ctx.shadowColor = colors.gray;
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(tile.name.split('|')[0], tile.x + tileSize * 0.05, tile.y + tileSize - tileSize * 0.05);
    } else {
      ctx.fillStyle = colors.darkBlue;
      drawRoundedRect(ctx, tile.x, tile.y, tileSize, tileSize, 10);
      ctx.fill();
    }

    ctx.restore();
  });
}
