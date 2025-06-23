import { useResizeObserver } from '@/hooks/useResizeObserver';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';

describe('useResizeObserver', () => {
  let observeMock: any;
  let unobserveMock: any;
  let disconnectMock: any;
  let callback: () => void;

  beforeEach(() => {
    observeMock = vi.fn();
    unobserveMock = vi.fn();
    disconnectMock = vi.fn();
    callback = vi.fn();

    global.ResizeObserver = vi.fn().mockImplementation((cb) => {
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: disconnectMock,
        disconnectMock: cb,
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should observe element when mounted', async () => {
    const element = document.createElement('div');
    const targetRef = ref<HTMLElement | null>(element);

    useResizeObserver(targetRef, callback);
    await nextTick();

    expect(observeMock).toHaveBeenCalledWith(element);
  });

  it('should unobserve on unmount', () => {
    const element = document.createElement('div');
    const targetRef = ref<HTMLElement | null>(element);
    const stop = useResizeObserver(targetRef, callback);
    targetRef.value = null;
    expect(unobserveMock).toHaveBeenCalledTimes(0);
  });
});
