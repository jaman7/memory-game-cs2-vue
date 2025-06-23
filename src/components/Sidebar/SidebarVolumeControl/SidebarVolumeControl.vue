<template>
  <div
    class="volume-control"
    :style="{
      '--val': localVolume,
      '--min': 0,
      '--max': 100,
      '--pos': `calc((var(--val) - var(--min)) / (var(--max) - var(--min)) * 100%)`,
    }"
  >
    <div class="volume-header">
      <span class="volume-label">{{ $t('volumeControl.title') }}</span>
      <Button :handleClick="toggleMute" :aria-label="isMuted ? 'speaker off' : 'speaker on'" :className="clsx('speaker', { muted: isMuted })" variant="round">
        <LazyImage :src="`/images/speaker${isMuted ? '-muted' : ''}.svg`" :alt="`speaker${isMuted ? '-muted' : ''}`" />
      </Button>
    </div>

    <div class="volume-slider-wrapper">
      <input
        type="range"
        class="range-volume"
        min="0"
        max="100"
        step="1"
        v-model.number="localVolume"
        @input="onVolumeChange"
        aria-label="Głośność"
        list="volume-ticks"
      />
      <div class="volume-indicator">{{ localVolume }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSoundStore } from '@/stores/useSoundStore';
import { clsx } from 'clsx';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const soundStore = useSoundStore();
const { isMuted, volume } = storeToRefs(soundStore);
const { toggleMute, setVolume } = soundStore;

const localVolume = ref(Math.round(volume.value * 100));

watch(volume, (v) => {
  if (!isMuted.value) {
    localVolume.value = Math.round(v * 100);
  }
});

function onVolumeChange() {
  setVolume(localVolume.value / 100);
}
</script>

<style scoped src="./SidebarVolumeControl.scss" />
