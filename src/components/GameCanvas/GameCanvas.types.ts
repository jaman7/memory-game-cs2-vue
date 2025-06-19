export interface GameHistoryEntry {
  time: number;
  moves: number;
  date: string;
  seed: string;
  difficulty: number;
}

export type Rarity = 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert';

export interface Tile {
  id: number;
  name: string;
  rarity: Rarity;
  pairId: number;
  flipped: boolean;
  matched: boolean;
  x: number;
  y: number;
  imagePath?: string;
  color?: string;
  value?: number;
  haloAngle?: number;
}

export interface Skin {
  id: number;
  name: string;
  imagePath: string;
  rarity: Rarity;
}

export interface GameState {
  tiles: Tile[];
  elapsedSeconds: number;
  moves: number;
  seed: string;
  difficulty: number;
}

export type ParallaxState = {
  mouseX: number;
  mouseY: number;
};
