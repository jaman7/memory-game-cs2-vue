<template>
  <div class="modal" role="dialog" aria-modal="true">
    <h2 class="modal-title mb-2">{{ $t('modalStart.title') }}</h2>

    <p class="modal-info">
      {{ $t('modalStart.noActiveGameInfo') }}
    </p>

    <InputField
      id="seed"
      v-model="localSeed"
      :label="$t('modalStart.seedLabel')"
      :placeholder="'np. awp-king'"
      :description="$t('modalStart.seed')"
      describedby="seed-desc"
    />

    <SelectField
      id="difficulty"
      v-model="localDifficulty"
      :label="$t('modalStart.difficultyLabel')"
      :description="$t('modalStart.difficulty')"
      describedby="difficulty-desc"
      :options="difficulties"
    />
    <p id="difficulty-desc" class="sr-only mb-2">{{ $t('modalStart.difficulty') }}</p>

    <div class="modal-actions">
      <Button name="modalStart.button" :handleClick="startGame" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  inheritAttrs: false,
});
defineProps<{}>();

const { t } = useI18n();
const emit = defineEmits<{
  (e: 'start', payload: { seed: string; difficulty: number }): void;
}>();

const localSeed = ref('');
const localDifficulty = ref(1);

const difficulties = computed(() => [
  { id: 1, displayName: t('difficultyDict.easy') },
  { id: 2, displayName: t('difficultyDict.medium') },
  { id: 3, displayName: t('difficultyDict.hard') },
]);

function startGame() {
  emit('start', {
    seed: localSeed.value.trim(),
    difficulty: localDifficulty.value,
  });
}
</script>
