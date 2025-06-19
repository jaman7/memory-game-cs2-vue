import { Howl } from 'howler';

export const sounds = {
  flip: new Howl({ src: ['/sounds/flip.mp3'] }),
  match: new Howl({ src: ['/sounds/match.mp3'] }),
  fail: new Howl({ src: ['/sounds/fail.mp3'] }),
  win: new Howl({ src: ['/sounds/win.mp3'] }),
};
