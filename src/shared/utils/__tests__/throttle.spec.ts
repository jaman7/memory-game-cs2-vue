import { throttle } from '@/shared/utils/throttle';
import { describe, expect, it, vi } from 'vitest';

describe('throttle', () => {
  it('should limit function execution', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const throttledFn = throttle(callback, 1000);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);
    throttledFn();
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);
    throttledFn();
    expect(callback).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
