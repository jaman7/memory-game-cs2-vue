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
      <span class="volume-label">Dźwięk</span>
      <Button
        :handleClick="toggleMute"
        :aria-label="isMuted ? 'Włącz dźwięk' : 'Wycisz dźwięk'"
        :className="clsx(['speaker', { muted: isMuted }])"
        variant="round"
      >
        <component :is="isMuted ? SpeakerMutedIcon : SpeakerIcon" class="icon-svg" />
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
import { useSoundSettings } from '@/hooks/useSoundSettings';
import SpeakerMutedIcon from '@images/speaker-muted.svg';
import SpeakerIcon from '@images/speaker.svg';
import { clsx } from 'clsx';
import { ref, watch } from 'vue';

const { isMuted, volume, toggleMute, setVolume } = useSoundSettings();

const localVolume = ref(Math.round(volume.value * 100));

watch(volume, (v) => {
  if (!isMuted.value) {
    localVolume.value = Math.round(v * 100);
  }
  if (isMuted.value) toggleMute();
});

function onVolumeChange() {
  setVolume(localVolume.value / 100);
}
</script>

<style scoped src="./VolumeControl.scss" />
