<template>
  <div class="demo-container" ref="containerRef">
    <div class="demo-game" ref="gameRef" :style="gridStyle">
      <div v-for="tile in tiles" :key="tile.id" class="tile" :class="[{ flipped: tile.flipped, matched: tile.matched }]">
        <div class="tile-front" :class="[`rarity-${tile.rarity}`, { [`rarity-border-${tile.rarity}`]: tile.matched }]">
          <LazyImage :src="tile.imagePath" :alt="tile.name" className="tile-img" />
          <span class="tile-name">{{ tile.name }}</span>
        </div>
        <div class="tile-back"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDemoGame } from '@/hooks/useDemoGame';
import { useResizeObserver } from '@/hooks/useResizeObserver';
import { ref, watch } from 'vue';

const { tiles } = useDemoGame(() => setTimeout(() => scaleGrid(), 600));
const containerRef = ref<HTMLElement | null>(null);
const gameRef = ref<HTMLElement | null>(null);

function scaleGrid() {
  const container = containerRef.value;
  const game = gameRef.value;
  if (!container || !game) return;
  const gameHeight = game.offsetHeight;
  const containerHeight = container.clientHeight;
  const scale = Math.min(1, containerHeight / gameHeight);
  game.style.transform = `scale(${scale})`;
}

const gridStyle = computed(() => {
  const cols = Math.min(6, Math.ceil(Math.sqrt(tiles.value.length)));
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '8px',
    padding: '1rem',
  };
});

useResizeObserver(containerRef, () => {
  scaleGrid();
});

watch(tiles, () => {
  scaleGrid();
});
</script>

<style scoped src="./GameCanvasDemo.scss" />
