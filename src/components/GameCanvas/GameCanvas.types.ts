export type Rarity = 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert';
export type MatchResult = 'match' | 'mismatch';

export interface MatchRecord {
  a: Tile;
  b: Tile;
  result: MatchResult;
  timestamp?: number;
}

export interface GameHistoryEntry {
  dateStart: string | null;
  dateEnd: string | null;
  time: number;
  moves: number;
  seed: string;
  difficulty: number;
  matchCount: number;
  mismatchCount: number;
  matchedPairs: MatchRecord[];
}

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
  dateStart: string | null;
  tiles: Tile[];
  elapsedSeconds: number;
  moves: number;
  seed: string;
  difficulty: number;
  matchCount: number;
  mismatchCount: number;
  matchedPairs: MatchRecord[];
}

export type ParallaxState = {
  mouseX: number;
  mouseY: number;
};
