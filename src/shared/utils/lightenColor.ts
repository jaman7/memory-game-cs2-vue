export function lightenColor(hex: string, amount = 0.2): string {
  const clamp = (v: number) => Math.min(255, Math.max(0, v));
  const [r, g, b] = hex
    .replace('#', '')
    .match(/.{2}/g)!
    .map((c) => parseInt(c, 16));
  const lighter = [r, g, b].map((v) => clamp(Math.floor(v + (255 - v) * amount)));
  return `rgb(${lighter.join(',')})`;
}
