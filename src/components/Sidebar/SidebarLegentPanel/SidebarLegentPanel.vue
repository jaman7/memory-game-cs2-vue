<template>
  <CollapsiblePanel :title="$t('rarityLegend.title')">
    <div class="sidebar-rarity-legend-panel">
      <div v-for="rarity in rarities" :key="rarity" class="legend-item">
        <span class="legend-color" :style="{ backgroundColor: RarityColors[rarity] }" />
        <span>{{ $t('rarityLegend.' + rarity) }}</span>
      </div>
    </div>
  </CollapsiblePanel>
</template>

<script setup lang="ts">
import { rarities, RarityColors } from '@/components/GameCanvas/GameCanvas.const';

defineOptions({
  inheritAttrs: false,
});
defineProps<{}>();
</script>

<style scoped src="./SidebarLegentPanel.scss" />
