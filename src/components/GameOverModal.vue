<template>
  <div class="modal">
    <div class="modal-content">
      <h2 class="modal-title mb-2">{{ $t('modalEnd.title') }}</h2>
      <p class="modal-message">{{ $t('modalEnd.message', { time, moves }) }}</p>

      <div class="modal-actions">
        <Button name="modalEnd.buttonReplay" :handleClick="() => $emit('restart')" />
        <Button name="modalEnd.buttonNew" :handleClick="() => $emit('newgame')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  time: string;
  moves: number;
}>();

defineEmits<{
  (e: 'restart'): void;
  (e: 'newgame'): void;
}>();

console.log(props.time, props.moves);
</script>
