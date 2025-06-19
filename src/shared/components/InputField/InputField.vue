<template>
  <div class="input-field">
    <label :for="id" class="input-label">{{ label }}</label>
    <input :id="id" type="text" :placeholder="placeholder" :aria-describedby="describedby" v-model="inputValue" class="input-element" />
    <p v-if="description" :id="describedby" class="input-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  id: string;
  label: string;
  placeholder?: string;
  description?: string;
  modelValue: string;
  describedby?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});
</script>

<style scoped src="./InputField.scss" />
