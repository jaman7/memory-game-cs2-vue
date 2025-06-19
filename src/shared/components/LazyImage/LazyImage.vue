<template>
  <div>
    <div v-if="!loaded" class="lazy-placeholder" data-testid="lazy-placeholder" aria-hidden="true" />
    <img
      :id="id"
      loading="lazy"
      :src="error || !src ? defaultLogo : src"
      :alt="alt"
      ref="imgRef"
      :class="['img-fluid', className, loaded ? 'lazyloaded' : 'lazyloading']"
      @load="onLoad"
      @error="onError"
      @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

defineProps<{
  id?: string;
  className?: string;
  src?: string | null;
  alt?: string;
  onClick?: () => void;
}>();

const defaultLogo = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

const loaded = ref(false);
const error = ref(false);
const imgRef = ref<HTMLImageElement | null>(null);

function onLoad() {
  loaded.value = true;
}
function onError() {
  error.value = true;
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  if (imgRef.value) observer.observe(imgRef.value);
  onUnmounted(() => observer.disconnect());
});
</script>

<style scoped src="./LazyImage.scss" />
