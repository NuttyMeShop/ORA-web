// ORA Types - Matching mobile app structure

export interface Card {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'cups' | 'wands' | 'swords' | 'pentacles';
  number?: number;
  image?: string;
  keywords?: string[];
}

export interface SelectedCard {
  card: Card;
  position: number;
  positionTitle?: string;
  reversed?: boolean;
}

export type ReadingType = 'daily' | 'yesno' | 'guidance' | 'path' | 'deep';

export interface Reading {
  id: string;
  type: ReadingType;
  question: string;
  cards: SelectedCard[];
  interpretation: string;
  timestamp: number;
  locked?: boolean;
  deckId?: string;
}

export interface Axe {
  title: string;
  reason: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: 'FREE' | 'PREMIUM';
  credits: number;
  language: string;
}

export interface PsychProfile {
  fear?: string;
  pattern?: string;
  value?: string;
  risk?: string;
  focus?: string;
}

export interface LifeMapEntry {
  date: string;
  type: ReadingType;
  question: string;
  cards: string[];
  themes: string[];
  archetypes: string[];
  interpretation: string;
}

export interface MemoryPattern {
  type: string;
  description: string;
  frequency: number;
}

export interface SessionState {
  state: 'obsessive_loop' | 'emotional_urgency' | 'decision_crossroads' | 'existential_void' | 'exploratory' | 'normal';
  signals: string[];
  intensity: number;
}

export interface PaywallData {
  readingId: string;
  preview: string;
  fullInterpretation: string;
  paywall: {
    title: string;
    subtitle: string;
    cost?: number;
  };
}
