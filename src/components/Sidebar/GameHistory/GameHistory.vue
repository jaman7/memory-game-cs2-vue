<template>
  <div class="game-history">
    <ul v-if="history.length > 0" class="history-list">
      <li v-for="(entry, index) in history" :key="index" class="history-item">
        <div class="history-seed">
          <b>{{ entry.seed }}</b> ({{ entry.difficulty }})
        </div>
        <div class="history-details">
          {{ $t('history.timeMoves', { time: entry.time, moves: entry.moves }) }}
        </div>
        <div class="history-details">
          {{ $t('history.matchedCount', { matchCount: entry.matchCount, mismatchCount: entry.mismatchCount }) }}
        </div>
        <div class="history-date">
          {{ formatDate(entry?.dateStart ?? '') }}
        </div>

        <CollapsiblePanel :title="$t('history.matchedMismatch')" :size="'xs'">
          <div class="match-history-list">
            <div v-if="!entry.matchedPairs.length" class="match-history-list--empty-msg">{{ $t('devToolPanel.matchHistory.empty') }}</div>
            <div v-else class="match-history-list--list">
              <div v-for="(item, index) in entry.matchedPairs" :key="index" class="match-history-list--entry">
                <div class="type">
                  <span class="time">at: {{ item.timestamp ? useFormattedTime(ref(Number((item.timestamp / 1000).toFixed(1)))) : '' }}</span>
                  <template v-if="item.result === 'match'"
                    ><span class="match"><VIcon name="fa-check" /> {{ $t('devToolPanel.matchHistory.match') }}</span></template
                  >
                  <template v-else
                    ><span class="mismatch"><VIcon name="fa-times" /> {{ $t('devToolPanel.matchHistory.mismatch') }}</span></template
                  >
                </div>
                <div class="match-history-list--pair">
                  <TilePreview :tile="item.a" />
                  <span class="vs">vs</span>
                  <TilePreview :tile="item.b" />
                </div>
              </div>
            </div>
          </div>
        </CollapsiblePanel>
      </li>
    </ul>
    <p v-else class="history-empty">{{ $t('history.error') }}</p>
  </div>
</template>

<script setup lang="ts">
import type { GameHistoryEntry } from '@/components/GameCanvas/GameCanvas.types';
import { useFormattedTime } from '@/hooks/useFormattedTime';
import './GameHistory.scss';

defineProps<{
  history: GameHistoryEntry[];
}>();

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pl-PL');
}
</script>
