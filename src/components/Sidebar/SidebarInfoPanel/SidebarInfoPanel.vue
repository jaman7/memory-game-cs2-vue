<template>
  <div class="sidebar-info-panel">
    <p>
      <strong>{{ $t('sidebar.time') }}</strong> {{ formattedTime ?? '' }}
    </p>
    <p>
      <strong>{{ $t('sidebar.dateStart') }}</strong> {{ formattedDateTime ?? '' }}
    </p>
    <p>
      <strong>{{ $t('sidebar.moves') }}</strong> {{ gameStore.moves ?? 0 }}
    </p>
    <p>
      <strong>{{ $t('sidebar.matchCount') }}</strong> {{ gameStore.matchCount ?? 0 }}
    </p>
    <p>
      <strong>{{ $t('sidebar.mismatchCount') }}</strong> {{ gameStore.mismatchCount ?? 0 }}
    </p>
    <p>
      <strong>{{ $t('sidebar.seed') }}</strong> {{ gameStore.seed ?? '' }}
    </p>
    <p>
      <strong>{{ $t('sidebar.difficulty') }}</strong> {{ difficultyLabel ?? '' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useFormattedTime } from '@/hooks/useFormattedTime';
import { useGameStore } from '@/stores/useGameStore';
import { useI18n } from 'vue-i18n';

defineOptions({
  inheritAttrs: false,
});
defineProps<{}>();

const { t } = useI18n();

const gameStore = useGameStore();
const elapsed = computed(() => gameStore.elapsed);
const formattedTime = useFormattedTime(elapsed);
const formattedDateTime = useDateFormat(gameStore.dateStart ?? '', 'YYYY-MM-DD HH:mm:ss');

const difficultyLabel = computed(() => {
  switch (gameStore.difficulty) {
    case 1:
      return t('difficultyDict.easy');
    case 2:
      return t('difficultyDict.medium');
    case 3:
      return t('difficultyDict.hard');
    default:
      return t('difficultyDict.unknown');
  }
});
</script>

<style scoped src="./SidebarInfoPanel.scss" />
