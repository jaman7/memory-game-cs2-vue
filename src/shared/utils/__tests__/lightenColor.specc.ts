import { lightenColor } from '@/shared/utils/lightenColor';
import { describe, expect, it } from 'vitest';

describe('lightenColor', () => {
  it('should correctly lighten a dark color', () => {
    expect(lightenColor('#000000', 0.2)).toBe('#333333');
  });

  it('should correctly lighten arbitrary colors', () => {
    expect(lightenColor('#123456', 10)).toBe('#2b4e6e');
    expect(lightenColor('#abcdef', 15)).toBe('#c4d9f1');
  });

  it('should not exceed maximum color value', () => {
    expect(lightenColor('#ffffff', 20)).toBe('#ffffff');
  });

  it('should handle invalid input gracefully', () => {
    expect(() => lightenColor('invalid', 10)).toThrow();
  });
});
