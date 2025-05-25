
import { GameState, PlayerState, PlayerAction, Card, GamePhase } from '@/types/poker';
import { Deck } from './deck';
import { evaluateHand, compareHands, HandRank } from './handEvaluator';

export interface SidePot {
  amount: number;
  eligiblePlayers: string[];
}

export interface GameResult {
  winners: Array<{
    playerId: string;
    winAmount: number;
    handRank: HandRank;
    sidePotIndex?: number;
  }>;
  sidePots: SidePot[];
}

export class PokerGameEngine {
  private game: GameState;
  private players: PlayerState[];
  private deck: Deck;
  private readonly SMALL_BLIND = 5;
  private readonly BIG_BLIND = 10;

  constructor(gameState: GameState, players: PlayerState[]) {
    this.game = { ...gameState };
    this.players = [...players];
    this.deck = new Deck();
  }

  getGameState(): GameState {
    return { ...this.game };
  }

  getPlayers(): PlayerState[] {
    return [...this.players];
  }

  startNewHand(): void {
    // Reset deck and shuffle
    this.deck.reset();
    
    // Reset player states for new hand
    this.players.forEach(player => {
      if (player.status === 'SITTING') {
        player.status = 'PLAYING';
        player.currentBet = 0;
        player.holeCards = [];
        player.isDealer = false;
        player.isSmallBlind = false;
        player.isBigBlind = false;
      }
    });

    // Set dealer, small blind, and big blind
    this.assignPositions();
    
    // Deal hole cards
    this.dealHoleCards();
    
    // Post blinds
    this.postBlinds();
    
    // Set game state
    this.game.phase = 'PREFLOP';
    this.game.pot = this.SMALL_BLIND + this.BIG_BLIND;
    this.game.currentBet = this.BIG_BLIND;
    this.game.communityCards = [];
    
    // Set active player (first to act after big blind)
    this.setNextActivePlayer();
  }

  private assignPositions(): void {
    const activePlayers = this.players.filter(p => p.status === 'PLAYING');
    if (activePlayers.length < 2) return;

    // Move dealer button
    let dealerIndex = this.game.dealerSeat || 0;
    do {
      dealerIndex = (dealerIndex + 1) % 9;
    } while (!activePlayers.find(p => p.seatNumber === dealerIndex));

    this.game.dealerSeat = dealerIndex;

    // Assign dealer, small blind, big blind
    const dealer = activePlayers.find(p => p.seatNumber === dealerIndex);
    if (dealer) dealer.isDealer = true;

    if (activePlayers.length === 2) {
      // Heads up: dealer is small blind
      if (dealer) dealer.isSmallBlind = true;
      const opponent = activePlayers.find(p => p.seatNumber !== dealerIndex);
      if (opponent) opponent.isBigBlind = true;
    } else {
      // Find small blind (next player after dealer)
      let sbIndex = dealerIndex;
      do {
        sbIndex = (sbIndex + 1) % 9;
      } while (!activePlayers.find(p => p.seatNumber === sbIndex));
      
      const smallBlind = activePlayers.find(p => p.seatNumber === sbIndex);
      if (smallBlind) smallBlind.isSmallBlind = true;

      // Find big blind (next player after small blind)
      let bbIndex = sbIndex;
      do {
        bbIndex = (bbIndex + 1) % 9;
      } while (!activePlayers.find(p => p.seatNumber === bbIndex));
      
      const bigBlind = activePlayers.find(p => p.seatNumber === bbIndex);
      if (bigBlind) bigBlind.isBigBlind = true;
    }
  }

  private dealHoleCards(): void {
    const activePlayers = this.players.filter(p => p.status === 'PLAYING');
    
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

  private postBlinds(): void {
    const smallBlind = this.players.find(p => p.isSmallBlind);
    const bigBlind = this.players.find(p => p.isBigBlind);

    if (smallBlind) {
      const sbAmount = Math.min(this.SMALL_BLIND, smallBlind.stack);
      smallBlind.currentBet = sbAmount;
      smallBlind.stack -= sbAmount;
      if (smallBlind.stack === 0) smallBlind.status = 'ALL_IN';
    }

    if (bigBlind) {
      const bbAmount = Math.min(this.BIG_BLIND, bigBlind.stack);
      bigBlind.currentBet = bbAmount;
      bigBlind.stack -= bbAmount;
      if (bigBlind.stack === 0) bigBlind.status = 'ALL_IN';
    }
  }

  private setNextActivePlayer(): void {
    const activePlayers = this.players.filter(p => 
      p.status === 'PLAYING' || p.status === 'ALL_IN'
    );
    
    if (activePlayers.length === 0) {
      this.game.activeSeat = undefined;
      return;
    }

    let currentSeat = this.game.activeSeat || 0;
    let attempts = 0;
    
    do {
      currentSeat = (currentSeat + 1) % 9;
      attempts++;
    } while (
      attempts < 9 && 
      !activePlayers.find(p => p.seatNumber === currentSeat && p.status === 'PLAYING')
    );

    const activePlayer = activePlayers.find(p => 
      p.seatNumber === currentSeat && p.status === 'PLAYING'
    );
    
    this.game.activeSeat = activePlayer ? activePlayer.seatNumber : undefined;
  }

  processAction(playerId: string, action: PlayerAction, amount?: number): boolean {
    const player = this.players.find(p => p.playerId === playerId);
    if (!player || player.seatNumber !== this.game.activeSeat) {
      return false;
    }

    const callAmount = Math.max(0, this.game.currentBet - player.currentBet);

    switch (action) {
      case 'FOLD':
        player.status = 'FOLDED';
        break;

      case 'CHECK':
        if (callAmount > 0) return false; // Can't check if there's a bet
        break;

      case 'CALL':
        if (callAmount === 0) return false;
        const actualCall = Math.min(callAmount, player.stack);
        player.currentBet += actualCall;
        player.stack -= actualCall;
        this.game.pot += actualCall;
        if (player.stack === 0) player.status = 'ALL_IN';
        break;

      case 'BET':
      case 'RAISE':
        if (!amount || amount <= 0) return false;
        const totalBet = player.currentBet + amount;
        if (totalBet <= this.game.currentBet) return false;
        if (amount > player.stack) return false;
        
        player.currentBet += amount;
        player.stack -= amount;
        this.game.pot += amount;
        this.game.currentBet = player.currentBet;
        if (player.stack === 0) player.status = 'ALL_IN';
        break;

      case 'ALL_IN':
        const allInAmount = player.stack;
        player.currentBet += allInAmount;
        player.stack = 0;
        player.status = 'ALL_IN';
        this.game.pot += allInAmount;
        if (player.currentBet > this.game.currentBet) {
          this.game.currentBet = player.currentBet;
        }
        break;

      default:
        return false;
    }

    // Check if betting round is complete
    if (this.isBettingRoundComplete()) {
      this.advanceToNextPhase();
    } else {
      this.setNextActivePlayer();
    }

    return true;
  }

  private isBettingRoundComplete(): boolean {
    const activePlayers = this.players.filter(p => 
      p.status === 'PLAYING' || p.status === 'ALL_IN'
    );
    
    if (activePlayers.length <= 1) return true;

    const playingPlayers = activePlayers.filter(p => p.status === 'PLAYING');
    if (playingPlayers.length === 0) return true;

    // Check if all playing players have acted and matched the current bet
    return playingPlayers.every(p => 
      p.currentBet === this.game.currentBet || p.stack === 0
    );
  }

  private advanceToNextPhase(): void {
    // Reset current bets for next round
    this.players.forEach(p => p.currentBet = 0);
    this.game.currentBet = 0;

    switch (this.game.phase) {
      case 'PREFLOP':
        this.dealFlop();
        this.game.phase = 'FLOP';
        break;
      case 'FLOP':
        this.dealTurn();
        this.game.phase = 'TURN';
        break;
      case 'TURN':
        this.dealRiver();
        this.game.phase = 'RIVER';
        break;
      case 'RIVER':
        this.game.phase = 'SHOWDOWN';
        return; // Don't set active player for showdown
    }

    // Set first player to act (after dealer)
    this.setFirstPlayerToAct();
  }

  private dealFlop(): void {
    // Burn one card
    this.deck.dealCard();
    
    // Deal 3 community cards
    for (let i = 0; i < 3; i++) {
      const card = this.deck.dealCard();
      if (card) this.game.communityCards.push(card);
    }
  }

  private dealTurn(): void {
    this.deck.dealCard(); // Burn card
    const card = this.deck.dealCard();
    if (card) this.game.communityCards.push(card);
  }

  private dealRiver(): void {
    this.deck.dealCard(); // Burn card
    const card = this.deck.dealCard();
    if (card) this.game.communityCards.push(card);
  }

  private setFirstPlayerToAct(): void {
    const activePlayers = this.players.filter(p => p.status === 'PLAYING');
    
    if (activePlayers.length === 0) {
      this.game.activeSeat = undefined;
      return;
    }

    // Start with small blind position
    let currentSeat = this.game.dealerSeat || 0;
    let attempts = 0;
    
    do {
      currentSeat = (currentSeat + 1) % 9;
      attempts++;
    } while (
      attempts < 9 && 
      !activePlayers.find(p => p.seatNumber === currentSeat)
    );

    this.game.activeSeat = currentSeat;
  }

  processShowdown(): GameResult {
    const activePlayers = this.players.filter(p => 
      p.status === 'PLAYING' || p.status === 'ALL_IN'
    );

    if (activePlayers.length === 0) {
      return { winners: [], sidePots: [] };
    }

    // If only one player remains, they win everything
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      winner.stack += this.game.pot;
      return {
        winners: [{
          playerId: winner.playerId,
          winAmount: this.game.pot,
          handRank: { rank: 0, name: 'Winner by Default', cards: [], kickers: [] }
        }],
        sidePots: [{ amount: this.game.pot, eligiblePlayers: [winner.playerId] }]
      };
    }

    // Create side pots based on all-in amounts
    const sidePots = this.calculateSidePots();
    const winners: GameResult['winners'] = [];

    // Evaluate hands for each side pot
    sidePots.forEach((sidePot, index) => {
      const eligiblePlayers = activePlayers.filter(p => 
        sidePot.eligiblePlayers.includes(p.playerId) && p.holeCards
      );

      if (eligiblePlayers.length === 0) return;

      // Evaluate hands
      const playerHands = eligiblePlayers.map(player => ({
        player,
        handRank: evaluateHand(player.holeCards!, this.game.communityCards)
      }));

      // Find the best hand(s)
      let bestHand = playerHands[0].handRank;
      playerHands.forEach(ph => {
        if (compareHands(ph.handRank, bestHand) > 0) {
          bestHand = ph.handRank;
        }
      });

      // Find all players with the best hand
      const potWinners = playerHands.filter(ph => 
        compareHands(ph.handRank, bestHand) === 0
      );

      // Distribute pot among winners
      const winAmount = Math.floor(sidePot.amount / potWinners.length);
      potWinners.forEach(winner => {
        winner.player.stack += winAmount;
        winners.push({
          playerId: winner.player.playerId,
          winAmount,
          handRank: winner.handRank,
          sidePotIndex: index
        });
      });
    });

    // Reset pot
    this.game.pot = 0;

    return { winners, sidePots };
  }

  private calculateSidePots(): SidePot[] {
    const activePlayers = this.players.filter(p => 
      p.status === 'PLAYING' || p.status === 'ALL_IN'
    );

    // Get all unique bet amounts
    const betAmounts = [...new Set(activePlayers.map(p => p.currentBet))]
      .sort((a, b) => a - b);

    const sidePots: SidePot[] = [];
    let previousAmount = 0;

    betAmounts.forEach(amount => {
      const potSize = (amount - previousAmount) * activePlayers.filter(p => 
        p.currentBet >= amount
      ).length;

      if (potSize > 0) {
        sidePots.push({
          amount: potSize,
          eligiblePlayers: activePlayers
            .filter(p => p.currentBet >= amount)
            .map(p => p.playerId)
        });
      }

      previousAmount = amount;
    });

    return sidePots;
  }
}
