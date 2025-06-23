import { isDifficultyType } from '@/shared/utils/isDifficultyType';
import { describe, expect, it } from 'vitest';

describe('isDifficultyType', () => {
  it('should return true for valid difficulty types', () => {
    expect(isDifficultyType(1)).toBe(true);
    expect(isDifficultyType(2)).toBe(true);
    expect(isDifficultyType(3)).toBe(true);
  });

  it('should return false for invalid difficulty types', () => {
    expect(isDifficultyType(0)).toBe(false);
    expect(isDifficultyType(4)).toBe(false);
    expect(isDifficultyType('easy' as any)).toBe(false);
    expect(isDifficultyType(null as any)).toBe(false);
    expect(isDifficultyType(undefined as any)).toBe(false);
  });
});
