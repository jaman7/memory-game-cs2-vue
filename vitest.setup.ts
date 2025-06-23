import * as matchers from '@testing-library/jest-dom/matchers';
import { config } from '@vue/test-utils';
import { beforeAll, expect } from 'vitest';
import 'vitest-canvas-mock';
import { createI18n } from 'vue-i18n';

expect.extend(matchers);

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {},
  },
});

beforeAll(() => {
  config.global.plugins = [i18n];
});

global.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};
