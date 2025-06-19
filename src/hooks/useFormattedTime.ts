import { computed, type Ref } from 'vue';

export function useFormattedTime(seconds: Ref<number>) {
  return computed(() => {
    const totalSeconds = seconds.value;

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const padded = (n: number) => String(n).padStart(2, '0');

    if (hrs > 0) {
      return `${padded(hrs)}:${padded(mins)}:${padded(secs)}`;
    }
    return `${padded(mins)}:${padded(secs)}`;
  });
}
