<template>
  <div class="collapsible-panel">
    <Button class="collapsible-header" :handleClick="() => (isOpen = !isOpen)">
      <span>{{ title }}</span>
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

const props = defineProps<{ title: string }>();
const isOpen = ref(false);
</script>

<style scoped src="./CollapsiblePanel.scss" />
