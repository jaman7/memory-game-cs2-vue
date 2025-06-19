<template>
  <div class="select-field">
    <label :for="id" class="select-label">{{ label ?? '' }}</label>
    <select :id="id" :aria-describedby="describedby" v-model.number="selectValue" class="select-element">
      <option v-for="option in options" :key="option.id" :value="option.id" class="select-option">
        {{ option.displayName }}
      </option>
    </select>
    <p v-if="description" :id="describedby" class="select-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  id: string;
  label: string;
  description?: string;
  describedby?: string;
  options: { id: number | string; displayName: string }[];
  modelValue: number;
}>();

const emit = defineEmits(['update:modelValue']);

const selectValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value),
});
</script>

<style scoped src="./SelectField.scss" />
