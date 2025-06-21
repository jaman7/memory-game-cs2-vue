import type { Ref } from 'vue';

export function useMouseCanvasPosition(canvasRef: Ref<HTMLCanvasElement | null>) {
  const getMousePosition = (event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.value;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    const clientX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
    const clientY = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  return { getMousePosition };
}
