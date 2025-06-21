export const preloadedImages: Record<string, HTMLImageElement> = {};

export function preloadImagesSync(paths: string[]) {
  paths.forEach((path) => {
    const lowerPath = path.toLowerCase();
    if (!preloadedImages[lowerPath]) {
      const img = new Image();
      img.src = path;

      img.onerror = () => {
        console.warn(`Image preload failed: ${path}`);
        delete preloadedImages[lowerPath];
      };

      preloadedImages[lowerPath] = img;
    }
  });
}

export async function preloadImagesWithAwait(paths: string[]) {
  const promises = paths.map((path) => {
    const lowerPath = path.toLowerCase();

    return new Promise<void>((resolve) => {
      if (preloadedImages[lowerPath]) {
        const img = preloadedImages[lowerPath];
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => {
          console.warn(`Image preload failed: ${path}`);
          delete preloadedImages[lowerPath];
          resolve();
        };
      } else {
        const img = new Image();
        img.src = path;
        preloadedImages[lowerPath] = img;

        if (img.complete) return resolve();

        img.onload = () => resolve();
        img.onerror = () => {
          console.warn(`Image preload failed: ${path}`);
          delete preloadedImages[lowerPath];
          resolve();
        };
      }
    });
  });

  await Promise.all(promises);
}
