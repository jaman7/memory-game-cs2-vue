import { useSoundEffects } from '@/hooks/useSoundEffects';
import { sounds } from '@/shared/sounds/sounds';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/sounds/sounds', () => ({
  sounds: {
    flip: { play: vi.fn() },
    match: { play: vi.fn() },
    fail: { play: vi.fn() },
    win: { play: vi.fn() },
  },
}));

describe('useSoundEffects', () => {
  let playFlip: () => Promise<void>;
  let playMatch: () => Promise<void>;
  let playFail: () => Promise<void>;
  let playWin: () => Promise<void>;

  beforeEach(() => {
    vi.clearAllMocks();
    ({ playFlip, playMatch, playFail, playWin } = useSoundEffects());
  });

  it('playFlip should call sounds.flip.play and return a resolved promise', async () => {
    const result = await playFlip();
    expect(sounds.flip.play).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('playMatch should call sounds.match.play and return a resolved promise', async () => {
    const result = await playMatch();
    expect(sounds.match.play).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('playFail should call sounds.fail.play and return a resolved promise', async () => {
    const result = await playFail();
    expect(sounds.fail.play).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('playWin should call sounds.win.play and return a resolved promise', async () => {
    const result = await playWin();
    expect(sounds.win.play).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
