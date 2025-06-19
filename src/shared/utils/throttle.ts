export function throttle<T extends (...args: any[]) => any>(fn: T, limit = 30000): T {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: any[]) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    } else if (!timeout) {
      timeout = setTimeout(
        () => {
          lastCall = Date.now();
          fn(...args);
          timeout = null;
        },
        limit - (now - lastCall)
      );
    }
  } as T;
}
