import { ref, watch } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue);

  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      data.value = JSON.parse(raw);
    } catch (e) {
      console.warn(`Cannot parse data from localStorage under key '${key}':`, e);
    }
  }

  watch(
    data,
    (newVal) => {
      localStorage.setItem(key, JSON.stringify(newVal));
    },
    { deep: true }
  );

  function clear() {
    localStorage.removeItem(key);
    data.value = defaultValue;
  }

  return {
    data,
    clear,
  };
}
