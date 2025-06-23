import { useClickLock } from '@/hooks/useClickLock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.useFakeTimers();

describe('useClickLock', () => {
  let isLocked: () => boolean;
  let lock: () => void;
  let unlock: () => void;

  beforeEach(() => {
    const result = useClickLock();
    lock = result.lock;
    unlock = result.unlock;
    isLocked = result.isLocked;
  });

  it('should be initially unlocked', () => {
    expect(isLocked()).toBe(false);
  });

  it('should lock and remain locked', () => {
    lock();
    expect(isLocked()).toBe(true);
  });

  it('should unlock after calling unlock', () => {
    lock();
    unlock();
    expect(isLocked()).toBe(false);
  });
});
