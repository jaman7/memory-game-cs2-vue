import type { Rarity, Tile } from './GameCanvas.types';

export const RarityColors: Record<Tile['rarity'], string> = {
  consumer: '#999999',
  industrial: '#5a9bd4',
  milspec: '#4b6cb7',
  restricted: '#cf6ccf',
  classified: '#f55',
  covert: '#f2b01e',
};

export const RarityBorders: Record<Rarity, string> = {
  consumer: '#b0b0b0',
  industrial: '#5e98d9',
  milspec: '#4b69ff',
  restricted: '#8847ff',
  classified: '#d32ce6',
  covert: '#eb4b4b',
};

export const colors: Record<string, string> = {
  black: '#000',
  tonedBlack: '#222',
  gray: '#444',
  darkBlue: '#0860d8',
  lightGray: 'oklch(97.7% 0.013 236.62)',
  shadowColor: 'rgba(21, 93, 252, 0.8)',
};

export const fontRoboto = '12px Roboto';
export const LocalStorageName = 'memory-game-history';

export const rarities: Rarity[] = ['consumer', 'industrial', 'milspec', 'restricted', 'classified', 'covert'];

export const weapons = [
  'ak47',
  'aug',
  'awp',
  'cz75a',
  'deagle',
  'famas',
  'five-seven',
  'g3sg1',
  'galil-ar',
  'glock-18',
  'm249',
  'm4a1',
  'm4a4',
  'mac-10',
  'mag-7',
  'mp5-sd',
  'mp7',
  'mp9',
  'negev',
  'nova',
  'p2000',
  'p250',
  'p90',
  'pp-bizon',
  'revolver',
  'sawed-off',
  'scar-20',
  'sg-556',
  'ssg-08',
  'taser',
  'tec-9',
  'ump-45',
  'usp-s',
  'xm1014',
];
