import { drawRoundedRect } from '@/shared/utils/drawRoundedRect';
import { describe, expect, it, vi } from 'vitest';

describe('drawRoundedRect', () => {
  it('should call canvas path methods with correct arguments', () => {
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arcTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    drawRoundedRect(ctx, 10, 20, 100, 50, 10);

    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.moveTo).toHaveBeenCalledWith(20, 20);
    expect(ctx.quadraticCurveTo).toHaveBeenCalledTimes(4);
    expect(ctx.closePath).toHaveBeenCalled();
  });
});
