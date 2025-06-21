export function useDebouncedRedraw(layoutAndRedraw: () => void, delay = 100) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  function debouncedRedraw() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      layoutAndRedraw();
    }, delay);
  }

  return {
    debouncedRedraw,
  };
}
