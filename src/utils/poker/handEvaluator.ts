
import { Card } from '@/types/poker';

export interface HandRank {
  rank: number;
  name: string;
  cards: Card[];
  kickers: string[];
}

// Ranking de manos (mayor número = mejor mano)
export const HAND_RANKINGS = {
  HIGH_CARD: 1,
  PAIR: 2,
  TWO_PAIR: 3,
  THREE_OF_A_KIND: 4,
  STRAIGHT: 5,
  FLUSH: 6,
  FULL_HOUSE: 7,
  FOUR_OF_A_KIND: 8,
  STRAIGHT_FLUSH: 9,
  ROYAL_FLUSH: 10
};

const CARD_VALUES: Record<string, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, 
  '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

const VALUE_NAMES: Record<number, string> = {
  14: 'A', 13: 'K', 12: 'Q', 11: 'J', 10: '10',
  9: '9', 8: '8', 7: '7', 6: '6', 5: '5', 4: '4', 3: '3', 2: '2'
};

export function getCardValue(card: Card): number {
  return CARD_VALUES[card.value] || 0;
}

export function evaluateHand(holeCards: Card[], communityCards: Card[]): HandRank {
  const allCards = [...holeCards, ...communityCards];
  const bestHand = getBestFiveCardHand(allCards);
  return evaluateFiveCardHand(bestHand);
}

function getBestFiveCardHand(cards: Card[]): Card[] {
  if (cards.length < 5) return cards;
  
  const combinations = getCombinations(cards, 5);
  let bestHand = combinations[0];
  let bestRank = evaluateFiveCardHand(bestHand);
  
  for (let i = 1; i < combinations.length; i++) {
    const currentRank = evaluateFiveCardHand(combinations[i]);
    if (compareHands(currentRank, bestRank) > 0) {
      bestHand = combinations[i];
      bestRank = currentRank;
    }
  }
  
  return bestHand;
}

function getCombinations(arr: Card[], k: number): Card[][] {
  if (k === 1) return arr.map(card => [card]);
  if (k === arr.length) return [arr];
  
  const result: Card[][] = [];
  for (let i = 0; i <= arr.length - k; i++) {
    const head = arr[i];
    const tailCombinations = getCombinations(arr.slice(i + 1), k - 1);
    tailCombinations.forEach(tail => result.push([head, ...tail]));
  }
  
  return result;
}

function evaluateFiveCardHand(cards: Card[]): HandRank {
  if (cards.length !== 5) {
    throw new Error('Hand must contain exactly 5 cards');
  }
  
  const sortedCards = [...cards].sort((a, b) => getCardValue(b) - getCardValue(a));
  const values = sortedCards.map(getCardValue);
  const suits = sortedCards.map(card => card.suit);
  
  // Contar valores
  const valueCounts: Record<number, number> = {};
  values.forEach(value => {
    valueCounts[value] = (valueCounts[value] || 0) + 1;
  });
  
  const counts = Object.values(valueCounts).sort((a, b) => b - a);
  const uniqueValues = Object.keys(valueCounts).map(Number).sort((a, b) => b - a);
  
  // Verificar flush
  const isFlush = suits.every(suit => suit === suits[0]);
  
  // Verificar straight
  const isStraight = isConsecutive(values) || isWheelStraight(values);
  
  // Royal Flush
  if (isFlush && isStraight && values.includes(14)) {
    return {
      rank: HAND_RANKINGS.ROYAL_FLUSH,
      name: 'Royal Flush',
      cards: sortedCards,
      kickers: []
    };
  }
  
  // Straight Flush
  if (isFlush && isStraight) {
    return {
      rank: HAND_RANKINGS.STRAIGHT_FLUSH,
      name: 'Straight Flush',
      cards: sortedCards,
      kickers: [VALUE_NAMES[Math.max(...values)]]
    };
  }
  
  // Four of a Kind
  if (counts[0] === 4) {
    const fourKind = uniqueValues.find(value => valueCounts[value] === 4)!;
    const kicker = uniqueValues.find(value => valueCounts[value] === 1)!;
    return {
      rank: HAND_RANKINGS.FOUR_OF_A_KIND,
      name: 'Four of a Kind',
      cards: sortedCards,
      kickers: [VALUE_NAMES[fourKind], VALUE_NAMES[kicker]]
    };
  }
  
  // Full House
  if (counts[0] === 3 && counts[1] === 2) {
    const threeKind = uniqueValues.find(value => valueCounts[value] === 3)!;
    const pair = uniqueValues.find(value => valueCounts[value] === 2)!;
    return {
      rank: HAND_RANKINGS.FULL_HOUSE,
      name: 'Full House',
      cards: sortedCards,
      kickers: [VALUE_NAMES[threeKind], VALUE_NAMES[pair]]
    };
  }
  
  // Flush
  if (isFlush) {
    return {
      rank: HAND_RANKINGS.FLUSH,
      name: 'Flush',
      cards: sortedCards,
      kickers: uniqueValues.map(v => VALUE_NAMES[v])
    };
  }
  
  // Straight
  if (isStraight) {
    const highCard = isWheelStraight(values) ? 5 : Math.max(...values);
    return {
      rank: HAND_RANKINGS.STRAIGHT,
      name: 'Straight',
      cards: sortedCards,
      kickers: [VALUE_NAMES[highCard]]
    };
  }
  
  // Three of a Kind
  if (counts[0] === 3) {
    const threeKind = uniqueValues.find(value => valueCounts[value] === 3)!;
    const kickers = uniqueValues.filter(value => valueCounts[value] === 1);
    return {
      rank: HAND_RANKINGS.THREE_OF_A_KIND,
      name: 'Three of a Kind',
      cards: sortedCards,
      kickers: [VALUE_NAMES[threeKind], ...kickers.map(k => VALUE_NAMES[k])]
    };
  }
  
  // Two Pair
  if (counts[0] === 2 && counts[1] === 2) {
    const pairs = uniqueValues.filter(value => valueCounts[value] === 2).sort((a, b) => b - a);
    const kicker = uniqueValues.find(value => valueCounts[value] === 1)!;
    return {
      rank: HAND_RANKINGS.TWO_PAIR,
      name: 'Two Pair',
      cards: sortedCards,
      kickers: [VALUE_NAMES[pairs[0]], VALUE_NAMES[pairs[1]], VALUE_NAMES[kicker]]
    };
  }
  
  // Pair
  if (counts[0] === 2) {
    const pair = uniqueValues.find(value => valueCounts[value] === 2)!;
    const kickers = uniqueValues.filter(value => valueCounts[value] === 1);
    return {
      rank: HAND_RANKINGS.PAIR,
      name: 'Pair',
      cards: sortedCards,
      kickers: [VALUE_NAMES[pair], ...kickers.map(k => VALUE_NAMES[k])]
    };
  }
  
  // High Card
  return {
    rank: HAND_RANKINGS.HIGH_CARD,
    name: 'High Card',
    cards: sortedCards,
    kickers: uniqueValues.map(v => VALUE_NAMES[v])
  };
}

function isConsecutive(values: number[]): boolean {
  const sorted = [...values].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) {
      return false;
    }
  }
  return true;
}

function isWheelStraight(values: number[]): boolean {
  const sorted = [...values].sort((a, b) => a - b);
  return JSON.stringify(sorted) === JSON.stringify([2, 3, 4, 5, 14]);
}

export function compareHands(hand1: HandRank, hand2: HandRank): number {
  if (hand1.rank !== hand2.rank) {
    return hand1.rank - hand2.rank;
  }
  
  // Comparar kickers
  for (let i = 0; i < Math.max(hand1.kickers.length, hand2.kickers.length); i++) {
    const kicker1 = hand1.kickers[i] ? CARD_VALUES[hand1.kickers[i]] : 0;
    const kicker2 = hand2.kickers[i] ? CARD_VALUES[hand2.kickers[i]] : 0;
    
    if (kicker1 !== kicker2) {
      return kicker1 - kicker2;
    }
  }
  
  return 0; // Empate
}
