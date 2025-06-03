
export type PokerVariant = 'TEXAS_HOLDEM' | 'OMAHA' | 'OMAHA_HI_LO' | 'SEVEN_CARD_STUD' | 'FIVE_CARD_DRAW';

export interface VariantConfig {
  name: string;
  description: string;
  holeCards: number;
  communityCards: number;
  maxPlayers: number;
  betting_rounds: string[];
  hand_rankings?: string[];
}

export const POKER_VARIANTS: Record<PokerVariant, VariantConfig> = {
  TEXAS_HOLDEM: {
    name: 'Texas Hold\'em',
    description: 'The most popular poker variant',
    holeCards: 2,
    communityCards: 5,
    maxPlayers: 9,
    betting_rounds: ['PREFLOP', 'FLOP', 'TURN', 'RIVER']
  },
  OMAHA: {
    name: 'Omaha',
    description: 'Four hole cards, use exactly 2',
    holeCards: 4,
    communityCards: 5,
    maxPlayers: 9,
    betting_rounds: ['PREFLOP', 'FLOP', 'TURN', 'RIVER']
  },
  OMAHA_HI_LO: {
    name: 'Omaha Hi-Lo',
    description: 'Split pot between high and low hands',
    holeCards: 4,
    communityCards: 5,
    maxPlayers: 9,
    betting_rounds: ['PREFLOP', 'FLOP', 'TURN', 'RIVER']
  },
  SEVEN_CARD_STUD: {
    name: 'Seven Card Stud',
    description: 'No community cards, 7 cards per player',
    holeCards: 7,
    communityCards: 0,
    maxPlayers: 8,
    betting_rounds: ['THIRD_STREET', 'FOURTH_STREET', 'FIFTH_STREET', 'SIXTH_STREET', 'SEVENTH_STREET']
  },
  FIVE_CARD_DRAW: {
    name: 'Five Card Draw',
    description: 'Classic poker with card exchange',
    holeCards: 5,
    communityCards: 0,
    maxPlayers: 6,
    betting_rounds: ['INITIAL', 'DRAW']
  }
};
