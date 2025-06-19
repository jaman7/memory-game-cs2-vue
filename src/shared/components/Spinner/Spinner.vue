<template>
  <div role="status" :aria-label="ariaLabel" aria-busy="true" class="spinner">
    <div class="spinner-inner">
      <div class="spinner-loader" :style="loaderStyle" />
      <p class="spinner-text">{{ ariaLabel }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'medium',
  color: '#007bff',
  ariaLabel: 'Loading...',
});

const sizes = {
  small: '20px',
  medium: '40px',
  large: '60px',
};

const loaderStyle = computed(() => ({
  width: sizes[props.size],
  height: sizes[props.size],
  border: `4px solid ${props.color}`,
  borderTopColor: 'transparent',
  borderRadius: '50%',
}));
</script>

<style scoped src="./Spinner.scss" />
