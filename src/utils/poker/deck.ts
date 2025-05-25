
import { Card } from '@/types/poker';

const SUITS: Card['suit'][] = ['spades', 'hearts', 'diamonds', 'clubs'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export class Deck {
  private cards: Card[];
  private usedCards: Card[];

  constructor() {
    this.cards = [];
    this.usedCards = [];
    this.reset();
  }

  reset(): void {
    this.cards = [];
    this.usedCards = [];
    
    // Crear todas las cartas
    for (const suit of SUITS) {
      for (const value of VALUES) {
        this.cards.push({
          suit,
          value,
          code: `${value}${suit.charAt(0).toUpperCase()}`
        });
      }
    }
    
    this.shuffle();
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  dealCard(): Card | null {
    const card = this.cards.pop();
    if (card) {
      this.usedCards.push(card);
      return card;
    }
    return null;
  }

  dealCards(count: number): Card[] {
    const cards: Card[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.dealCard();
      if (card) {
        cards.push(card);
      }
    }
    return cards;
  }

  getRemainingCards(): number {
    return this.cards.length;
  }

  getUsedCards(): Card[] {
    return [...this.usedCards];
  }

  // Para testing y simulación
  removeSpecificCards(cardsToRemove: Card[]): void {
    cardsToRemove.forEach(cardToRemove => {
      const index = this.cards.findIndex(card => 
        card.suit === cardToRemove.suit && card.value === cardToRemove.value
      );
      if (index !== -1) {
        this.cards.splice(index, 1);
        this.usedCards.push(cardToRemove);
      }
    });
  }
}

export function createDeck(): Deck {
  return new Deck();
}
