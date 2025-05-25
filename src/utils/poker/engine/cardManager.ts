
import { GameState, PlayerState } from '@/types/poker';
import { Deck } from '../deck';

export class CardManager {
  private deck: Deck;

  constructor() {
    this.deck = new Deck();
  }

  resetDeck(): void {
    this.deck.reset();
  }

  dealHoleCards(players: PlayerState[]): void {
    const activePlayers = players.filter(p => p.status === 'PLAYING');
    
    // Deal 2 cards to each player
    for (let i = 0; i < 2; i++) {
      activePlayers.forEach(player => {
        const card = this.deck.dealCard();
        if (card) {
          if (!player.holeCards) player.holeCards = [];
          player.holeCards.push(card);
        }
      });
    }
  }

  dealFlop(game: GameState): void {
    // Burn one card
    this.deck.dealCard();
    
    // Deal 3 community cards
    for (let i = 0; i < 3; i++) {
      const card = this.deck.dealCard();
      if (card) game.communityCards.push(card);
    }
  }

  dealTurn(game: GameState): void {
    this.deck.dealCard(); // Burn card
    const card = this.deck.dealCard();
    if (card) game.communityCards.push(card);
  }

  dealRiver(game: GameState): void {
    this.deck.dealCard(); // Burn card
    const card = this.deck.dealCard();
    if (card) game.communityCards.push(card);
  }
}
