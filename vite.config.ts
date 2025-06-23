import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import { VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'; // opcjonalne
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),
    Components({
      dirs: ['src/components', 'src/shared/components'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/components.d.ts',
      resolvers: [VueUseComponentsResolver()],
      exclude: [],
    }),
    visualizer({
      filename: 'dist/report.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@scss': path.resolve(__dirname, './src/assests/scss'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        api: 'modern-compiler',
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import'],
        additionalData: `@use "@scss/mixins.scss"; @use "@scss/variables.scss";`,
      },
    },
    devSourcemap: true,
  },
  optimizeDeps: {
    include: ['pinia', 'howler', '@vueuse/core'],
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 700,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'pinia', 'vue-i18n', '@vueuse/core'],
          vendor: ['howler', 'clsx', 'oh-vue-icons'],
          canvas: [
            '@/hooks/useCanvasRenderer',
            '@/hooks/useMouseCanvasPosition',
            '@/hooks/useMouseTileHover',
            '@/hooks/useThrottledDraw',
            '@/shared/utils/canvasRenderer',
          ],
          game: ['@/hooks/useTileInteractions', '@/hooks/useGamePersistence', '@/stores/useGameStore', '@/stores/useGameHistoryStore'],
          ui: [
            '@/components/Sidebar/Sidebar.vue',
            '@/components/Sidebar/VolumeControl/VolumeControl.vue',
            '@/components/DevPanel/DevPanel.vue',
            '@/components/GameOverModal.vue',
            '@/components/StartModal.vue',
          ],
        },
      },
    },
  },
  define: {
    'process.env': {},
  },
  worker: {
    format: 'es',
  },
});
