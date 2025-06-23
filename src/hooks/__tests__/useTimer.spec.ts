import { useTimer } from '@/hooks/useTimer';
import { useGameStore } from '@/stores/useGameStore';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/stores/useGameStore', () => {
  return {
    useGameStore: vi.fn(() => ({
      incrementTime: vi.fn(),
      elapsed: 42,
    })),
  };
});

describe('useTimer', () => {
  let mockIncrementTime: ReturnType<typeof vi.fn>;
  let mockGameStore: ReturnType<typeof useGameStore>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockIncrementTime = vi.fn();
    mockGameStore = { incrementTime: mockIncrementTime, elapsed: 42 };
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockGameStore);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('should call incrementTime and onBackup every second', () => {
    const onBackup = vi.fn();
    const { start } = useTimer(onBackup);
    start();

    vi.advanceTimersByTime(3000);

    expect(mockIncrementTime).toHaveBeenCalledTimes(3);
    expect(onBackup).toHaveBeenCalledTimes(3);
  });

  it('should stop interval on stop()', () => {
    const { start, stop } = useTimer();
    start();
    stop();

    vi.advanceTimersByTime(2000);
    expect(mockIncrementTime).toHaveBeenCalledTimes(0); // nie powinno się wykonać
  });

  it('should reset elapsed to 0 and stop timer', () => {
    const { start, reset } = useTimer();
    start();
    reset();

    expect(mockGameStore.elapsed).toBe(0);
    vi.advanceTimersByTime(2000);
    expect(mockIncrementTime).toHaveBeenCalledTimes(0); // powinien być zatrzymany
  });
});
