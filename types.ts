export enum GameState {
  INTRO = 'INTRO',
  INPUT = 'INPUT',
  SHUFFLING = 'SHUFFLING',
  PICKING = 'PICKING',
  REVEAL = 'REVEAL',
  READING = 'READING',
}

export type SpreadType = 'SINGLE' | 'THREE';

export interface TarotCard {
  id: number;
  nameEn: string;
  nameCn: string;
  keywords: string[];
  image: string; // Filename or URL
}

export interface PickedCard extends TarotCard {
  isReversed: boolean;
}

export interface AudioMessage {
  id: string;
  text: string;
  buffer?: AudioBuffer; // Cached buffer
}

export interface TarotReadingResponse {
  text: string;
}