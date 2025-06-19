import { ref, watch } from 'vue';

export function useSoundSettings() {
  const isMuted = ref(false);
  const volume = ref(1);

  watch(volume, (v) => {
    Howler.volume(isMuted.value ? 0 : v);
  });

  watch(isMuted, (muted) => {
    Howler.volume(muted ? 0 : volume.value);
  });

  return {
    isMuted,
    volume,
    toggleMute: () => (isMuted.value = !isMuted.value),
    setVolume: (v: number) => (volume.value = Math.max(0, Math.min(1, v))),
  };
}
