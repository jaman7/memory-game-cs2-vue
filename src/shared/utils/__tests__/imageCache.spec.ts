import { preloadImagesSync, preloadImagesWithAwait, preloadedImages } from '@/shared/utils/imageCache';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('imageCache', () => {
  beforeEach(() => {
    for (const key in preloadedImages) {
      delete preloadedImages[key];
    }
  });

  it('should preload images synchronously', () => {
    const mockImageInstances: Record<string, HTMLImageElement> = {};

    vi.stubGlobal(
      'Image',
      class {
        src = '';
        set onerror(fn: (this: HTMLImageElement, ev: Event) => any) {}
      }
    );

    preloadImagesSync(['/images/test.png']);
    expect(preloadedImages['/images/test.png']).toBeDefined();
  });

  it('should preload images with await', async () => {
    const imageMock = {
      src: '',
      complete: false,
      onload: vi.fn(),
      onerror: vi.fn(),
    };

    vi.stubGlobal(
      'Image',
      vi.fn(() => imageMock)
    );

    const promise = preloadImagesWithAwait(['/images/abc.png']);
    imageMock.onload!();
    await promise;

    expect(preloadedImages['/images/abc.png']).toBe(imageMock);
  });

  it('should skip already loaded and complete images in async preload', async () => {
    const readyImage = {
      src: '/images/xyz.png',
      complete: true,
    } as HTMLImageElement;

    preloadedImages['/images/xyz.png'] = readyImage;

    await preloadImagesWithAwait(['/images/xyz.png']);
    expect(preloadedImages['/images/xyz.png']).toBe(readyImage);
  });
});
