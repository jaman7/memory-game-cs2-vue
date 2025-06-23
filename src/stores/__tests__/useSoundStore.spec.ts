import { useSoundStore } from '@/stores/useSoundStore';
import { flushPromises } from '@vue/test-utils';
import { Howler } from 'howler';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('howler', () => ({
  Howler: {
    volume: vi.fn(),
  },
}));

describe('useSoundStore', () => {
  let store: ReturnType<typeof useSoundStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useSoundStore();
  });

  it('initializes with default values and sets initial volume', async () => {
    expect(store.isMuted).toBe(false);
    expect(store.volume).toBe(1);

    await flushPromises();
    expect(Howler.volume).toHaveBeenCalledWith(1);
  });

  it('toggleMute toggles mute state and calls Howler.volume(0)', async () => {
    store.toggleMute();
    await flushPromises();
    expect(store.isMuted).toBe(true);
    expect(Howler.volume).toHaveBeenCalledWith(0);

    store.toggleMute();
    await flushPromises();
    expect(store.isMuted).toBe(false);
    expect(Howler.volume).toHaveBeenCalledWith(1);
  });

  it('setVolume sets volume within bounds and calls Howler.volume', async () => {
    store.setVolume(0.5);
    await flushPromises();
    expect(store.volume).toBe(0.5);
    expect(Howler.volume).toHaveBeenLastCalledWith(0.5);

    store.setVolume(-1);
    await flushPromises();
    expect(store.volume).toBe(0);
    expect(Howler.volume).toHaveBeenLastCalledWith(0);

    store.setVolume(1.5);
    await flushPromises();
    expect(store.volume).toBe(1);
    expect(Howler.volume).toHaveBeenLastCalledWith(1);
  });
});
