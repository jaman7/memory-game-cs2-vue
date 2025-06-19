export const preloadedImages: Record<string, HTMLImageElement> = {};

export function preloadImages(paths: string[]) {
  paths.forEach((path) => {
    if (!preloadedImages[path?.toLowerCase()]) {
      const img = new Image();
      img.src = path;

      img.onerror = () => {
        console.warn(`The image was not loaded: ${path}`);
        delete preloadedImages[path];
      };

      preloadedImages[path] = img;
    }
  });
}
