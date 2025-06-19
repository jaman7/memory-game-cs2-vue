import { onUnmounted, watch, type Ref } from 'vue';

export function useResizeObserver(targetRef: Ref<HTMLElement | null>, callback: () => void) {
  let observer: ResizeObserver | null = null;

  watch(
    targetRef,
    (element) => {
      if (!element) return;

      observer = new ResizeObserver(() => {
        callback();
      });
      observer.observe(element);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    if (observer && targetRef.value) {
      observer.unobserve(targetRef.value);
    }
    observer = null;
  });
}
