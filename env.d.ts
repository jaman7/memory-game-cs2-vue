/// <reference types="vue/macros-global" />
/// <reference types="vite/client" />
/// <reference types="vitest" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
