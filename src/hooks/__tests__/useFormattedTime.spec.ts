import { useFormattedTime } from '@/hooks/useFormattedTime';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

describe('useFormattedTime', () => {
  it('formats time < 1 minute correctly', () => {
    const time = ref(42);
    const formatted = useFormattedTime(time);
    expect(formatted.value).toBe('00:42');
  });

  it('formats time with minutes correctly', () => {
    const time = ref(125); // 2 minutes, 5 seconds
    const formatted = useFormattedTime(time);
    expect(formatted.value).toBe('02:05');
  });

  it('formats time with hours correctly', () => {
    const time = ref(3725); // 1 hour, 2 minutes, 5 seconds
    const formatted = useFormattedTime(time);
    expect(formatted.value).toBe('01:02:05');
  });

  it('formats fractional seconds correctly', () => {
    const time = ref(5.2);
    const formatted = useFormattedTime(time);
    expect(formatted.value).toBe('00:05.2');
  });
});
