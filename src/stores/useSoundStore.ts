import { Howler } from 'howler';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useSoundStore = defineStore('sound', () => {
  const isMuted = ref(false);
  const volume = ref(1);

  watch(
    [isMuted, volume],
    ([muted, vol]) => {
      Howler.volume(muted ? 0 : vol);
    },
    { immediate: true }
  );

  function toggleMute() {
    isMuted.value = !isMuted.value;
  }

  function setVolume(v: number): void {
    volume.value = Math.max(0, Math.min(1, v));
  }

  return {
    isMuted,
    volume,
    toggleMute,
    setVolume,
  };
});
