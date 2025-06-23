import type { Ref } from 'vue';

export function useMouseCanvasPosition(canvasRef: Ref<HTMLCanvasElement | null>) {
  const getMousePosition = (event: MouseEvent | TouchEvent | any) => {
    const canvas = canvasRef.value;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    const isTouchEvent = 'touches' in event;
    const clientX = isTouchEvent ? event.touches[0]?.clientX : event.clientX;
    const clientY = isTouchEvent ? event.touches[0]?.clientY : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  return { getMousePosition };
}
