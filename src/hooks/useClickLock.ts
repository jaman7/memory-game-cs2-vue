import { ref } from 'vue';

export function useClickLock() {
  const locked = ref(false);

  function isLocked() {
    return locked.value;
  }

  function lock() {
    locked.value = true;
  }

  function unlock() {
    locked.value = false;
  }

  return {
    isLocked,
    lock,
    unlock,
  };
}
