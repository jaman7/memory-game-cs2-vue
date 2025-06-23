import { useDebouncedRedraw } from '@/hooks/useDebouncedRedraw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useDebouncedRedraw', () => {
  let layoutAndRedraw: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    layoutAndRedraw = vi.fn();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('should call layoutAndRedraw after 100ms delay by default', () => {
    const { debouncedRedraw } = useDebouncedRedraw(layoutAndRedraw);

    debouncedRedraw();
    expect(layoutAndRedraw).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(layoutAndRedraw).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous call if invoked again before delay', () => {
    const { debouncedRedraw } = useDebouncedRedraw(layoutAndRedraw);

    debouncedRedraw();
    vi.advanceTimersByTime(50);
    debouncedRedraw();
    vi.advanceTimersByTime(50);
    expect(layoutAndRedraw).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(layoutAndRedraw).toHaveBeenCalledTimes(1);
  });

  it('should use custom delay value correctly', () => {
    const { debouncedRedraw } = useDebouncedRedraw(layoutAndRedraw, 200);

    debouncedRedraw();
    vi.advanceTimersByTime(199);
    expect(layoutAndRedraw).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(layoutAndRedraw).toHaveBeenCalledTimes(1);
  });
});
