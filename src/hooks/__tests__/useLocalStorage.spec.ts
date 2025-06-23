import { useLocalStorage } from '@/hooks/useLocalStorage';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

describe('useLocalStorage', () => {
  const key = 'test-key';
  const defaultValue = { a: 1 };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('uses default value if no localStorage value exists', () => {
    const { data } = useLocalStorage(key, defaultValue);
    expect(data.value).toEqual(defaultValue);
  });

  it('loads and parses existing localStorage value', () => {
    localStorage.setItem(key, JSON.stringify({ a: 42 }));
    const { data } = useLocalStorage(key, defaultValue);
    expect(data.value).toEqual({ a: 42 });
  });

  it('logs warning and uses default if JSON is invalid', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(key, 'invalid-json');
    const { data } = useLocalStorage(key, defaultValue);
    expect(data.value).toEqual(defaultValue);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('syncs changes to data with localStorage', async () => {
    const { data } = useLocalStorage(key, defaultValue);
    data.value = { a: 99 };
    await nextTick();
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual({ a: 99 });
  });

  it('clears localStorage and resets value', () => {
    localStorage.setItem(key, JSON.stringify({ a: 123 }));
    const { data, clear } = useLocalStorage(key, defaultValue);
    data.value = { a: 999 };
    clear();
    expect(localStorage.getItem(key)).toBeNull();
    expect(data.value).toEqual(defaultValue);
  });
});
