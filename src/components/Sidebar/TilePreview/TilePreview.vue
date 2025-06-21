<template>
  <div class="tile-preview">
    <LazyImage :src="tile.imagePath" :alt="tile.name" className="tile-preview--image" />
    <div class="tile-preview--info">
      <span class="tile-preview--name">{{ tile.name }}</span>
      <span class="tile-preview--rarity">{{ tile.rarity }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tile } from '@/components/GameCanvas/GameCanvas.types';
import './TilePreview.scss';
defineProps<{ tile: Tile }>();
</script>
