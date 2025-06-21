<template>
  <div class="collapsible" :class="props?.size ?? 'sm'">
    <Button className="collapsible-header" :size="props?.size ?? 'sm'" :handleClick="() => (isOpen = !isOpen)">
      <span>{{ props?.title ?? '' }}</span>
      <VIcon name="fa-chevron-down" :class="{ rotated: isOpen }" class="arrow-icon" />
    </Button>

    <transition name="fade">
      <div v-show="isOpen" class="collapsible-content">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ICollapsiblePanel } from './CollapsiblePanel.model';
import './CollapsiblePanel.scss';

const props = defineProps<ICollapsiblePanel>();
const isOpen = ref(false);
</script>
