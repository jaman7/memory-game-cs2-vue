<template>
  <aside :class="['sidebar', { open: gameStore.sidebarVisible }]" role="region">
    <Button className="sidebar-close" variant="round" :handleClick="() => gameStore.toggleSidebar(!gameStore.sidebarVisible)" aria-label="Zamknij panel">
      <VIcon name="fa-chevron-down" :class="{ rotated: gameStore.sidebarVisible }" class="arrow-icon" />
    </Button>

    <div class="sidebar-container">
      <SidebarLanguageFlags />

      <h2 class="sidebar-title">{{ $t('sidebar.title') }}</h2>

      <SidebarInfoPanel />

      <div class="sidebar-buttons-controls">
        <Button :handleClick="() => $emit('restart')" :name="'sidebar.buttonReplay'" />
        <Button :name="'sidebar.buttonNew'" :handleClick="() => $emit('newGame')" />
      </div>

      <SidebarVolumeControl />

      <SidebarStatsPanel />

      <SidebarMatches />

      <SidebarLegentPanel />

      <SidebarGameHistory />

      <div class="d-block">
        <Button name="sidebar.buttonDevTools" :handleClick="gameStore.toggleDevPanel" variant="secondary" />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/useGameStore';
import './Sidebar.scss';

const gameStore = useGameStore();

defineEmits(['restart', 'newGame']);
</script>
