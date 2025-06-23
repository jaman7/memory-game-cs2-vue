import { useMouseCanvasPosition } from '@/hooks/useMouseCanvasPosition';
import { beforeEach, describe, expect, it } from 'vitest';
import { ref, type Ref } from 'vue';

describe('useMouseCanvasPosition', () => {
  let canvas: HTMLCanvasElement;
  let canvasRef: Ref<HTMLCanvasElement | null>;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    Object.defineProperty(canvas, 'getBoundingClientRect', {
      value: () => ({
        left: 10,
        top: 20,
        right: 110,
        bottom: 220,
        width: 100,
        height: 200,
        x: 10,
        y: 20,
        toJSON: () => ({}),
      }),
    });
    canvasRef = ref(canvas);
  });

  it('returns correct mouse position for MouseEvent', () => {
    const { getMousePosition } = useMouseCanvasPosition(canvasRef);
    const mockEvent = { clientX: 50, clientY: 70 } as MouseEvent;

    const pos = getMousePosition(mockEvent);
    expect(pos).toEqual({ x: 40, y: 50 });
  });

  it('returns correct touch position for TouchEvent', () => {
    const { getMousePosition } = useMouseCanvasPosition(canvasRef);
    const mockTouchEvent = {
      touches: [{ clientX: 105, clientY: 210 }],
    };

    const pos = getMousePosition(mockTouchEvent);
    expect(pos).toEqual({ x: 95, y: 190 });
  });

  it('returns default position if canvas is null', () => {
    const nullRef = ref(null);
    const { getMousePosition } = useMouseCanvasPosition(nullRef);

    const mockEvent = { clientX: 0, clientY: 0 } as MouseEvent;
    const pos = getMousePosition(mockEvent);
    expect(pos).toEqual({ x: 0, y: 0 });
  });
});
