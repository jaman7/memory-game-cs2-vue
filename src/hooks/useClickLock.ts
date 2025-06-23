import { ref } from 'vue';

export function useClickLock() {
  const locked = ref(false);
  console.log(isLocked());

  function isLocked() {
    console.log('isLocked', locked.value);
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
