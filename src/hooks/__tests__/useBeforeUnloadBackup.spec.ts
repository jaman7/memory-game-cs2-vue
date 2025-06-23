import { useBeforeUnloadBackup } from '@/hooks/useBeforeUnloadBackup';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';

vi.mock('@/stores/useGameStore', () => ({
  useGameStore: () => ({
    seed: 'test-seed',
    difficulty: 1,
    gameState: { some: 'state' },
  }),
}));

const mockSaveState = vi.fn();
vi.mock('@/hooks/useGamePersistence', () => ({
  useGamePersistence: () => ({
    saveState: mockSaveState,
  }),
}));

describe('useBeforeUnloadBackup', () => {
  let addSpy: vi.SpyInstance;
  let removeSpy: vi.SpyInstance;

  beforeEach(() => {
    addSpy = vi.spyOn(window, 'addEventListener');
    removeSpy = vi.spyOn(window, 'removeEventListener');

    mockSaveState.mockClear();
  });

  it('should register beforeunload and pagehide listeners on mount', () => {
    const Comp = defineComponent({
      setup() {
        useBeforeUnloadBackup();
        return () => null;
      },
    });

    const wrapper = mount(Comp);
    expect(addSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('pagehide', expect.any(Function));
    wrapper.unmount();
  });

  it('should call saveState with gameState when unload event fires', () => {
    const Comp = defineComponent({
      setup() {
        useBeforeUnloadBackup();
        return () => null;
      },
    });

    const wrapper = mount(Comp);
    const handler = addSpy.mock.calls.find((call) => call[0] === 'beforeunload')?.[1];
    expect(typeof handler).toBe('function');

    handler?.(new Event('beforeunload'));
    expect(mockSaveState).toHaveBeenCalledWith({ some: 'state' });
    wrapper.unmount();
  });

  it('should remove both listeners on unmount', () => {
    const Comp = defineComponent({
      setup() {
        useBeforeUnloadBackup();
        return () => null;
      },
    });

    const wrapper = mount(Comp);
    const beforeUnloadHandler = addSpy.mock.calls.find((call) => call[0] === 'beforeunload')?.[1];
    const pagehideHandler = addSpy.mock.calls.find((call) => call[0] === 'pagehide')?.[1];

    wrapper.unmount();

    expect(removeSpy).toHaveBeenCalledWith('beforeunload', beforeUnloadHandler);
    expect(removeSpy).toHaveBeenCalledWith('pagehide', pagehideHandler);
  });
});
