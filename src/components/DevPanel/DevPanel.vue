<script setup lang="ts">
import { useFormattedTime } from '@/hooks/useFormattedTime';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import { useGameHistoryStore } from '@/stores/useGameHistoryStore';
import { useGameStore } from '@/stores/useGameStore';
import { computed } from 'vue';

const gameStore = useGameStore();
const historyStore = useGameHistoryStore();
const history = historyStore.history;
const formattedTime = useFormattedTime(computed(() => gameStore.elapsed));
const { saveState, clearState } = useGamePersistence(gameStore.seed, gameStore.difficulty);

function handleSave() {
  saveState(gameStore.gameState);
}

function handleReset() {
  clearState();
  gameStore.setGameStarted(false);
}

const statePreview = computed(() => ({
  seed: gameStore.seed,
  difficulty: gameStore.difficulty,
  moves: gameStore.moves,
  elapsed: formattedTime.value as string,
  tilesMatched: gameStore.tiles.filter((t) => t.matched).length,
  gameStarted: gameStore.gameStarted,
  gameOver: gameStore.gameOver,
}));
</script>

<template>
  <div class="dev-panel">
    <div class="dev-panel__header">
      <h3 class="dev-panel__title"><VIcon name="fa-tools" /> {{ $t('devToolPanel.title') }}</h3>
      <Button :handleClick="() => gameStore.toggleDevPanel()" variant="round" aria-label="Close Dev Panel"><VIcon name="fa-times" /></Button>
    </div>

    <pre class="dev-panel__preview">{{ JSON.stringify(statePreview, null, 2) }}</pre>

    <div class="dev-panel__buttons">
      <Button :handleClick="handleSave" className="gap-8"><VIcon name="fa-save" /> {{ $t('devToolPanel.btnSave') }}</Button>
      <Button :handleClick="handleReset" className="gap-8"><VIcon name="fa-undo" /> {{ $t('devToolPanel.btnReset') }}</Button>
    </div>

    <h4 class="dev-panel__subtitle"><VIcon name="fa-history" /> {{ $t('devToolPanel.history') }}</h4>

    <div class="dev-panel__history">
      <ul>
        <li v-for="(entry, index) in history" :key="index">
          <div>
            <strong>{{ entry.seed }}</strong> ({{ entry.difficulty }})
          </div>
          <div>{{ entry.time }}s / {{ entry.moves }} {{ $t('devToolPanel.moves') }}</div>
          <div>{{ new Date(entry.date).toLocaleString() }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped src="./DevPanel.scss" />
