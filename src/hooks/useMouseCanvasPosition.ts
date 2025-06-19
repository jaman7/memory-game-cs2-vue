import type { Ref } from 'vue';

export function useMouseCanvasPosition(canvasRef: Ref<HTMLCanvasElement | null>) {
  const getMousePosition = (event: MouseEvent) => {
    const canvas = canvasRef.value;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  return { getMousePosition };
}
