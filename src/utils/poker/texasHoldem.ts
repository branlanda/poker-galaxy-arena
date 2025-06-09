
import { GameState, PlayerState, Card } from '@/types/poker';
import { Deck } from './deck';

export class TexasHoldemEngine {
  private deck: Deck;
  private gameState: GameState;
  private players: PlayerState[];

  constructor(gameState: GameState, players: PlayerState[]) {
    this.deck = new Deck();
    this.gameState = { ...gameState };
    this.players = [...players];
  }

  // Start a new hand
  startNewHand(): void {
    // Reset deck
    this.deck.reset();
    
    // Reset players for new hand
    this.players.forEach(player => {
      if (player.status === 'SITTING') {
        player.status = 'PLAYING';
      }
      player.holeCards = [];
      player.currentBet = 0;
      player.isDealer = false;
      player.isSmallBlind = false;
      player.isBigBlind = false;
    });

    // Set positions
    this.setPositions();
    
    // Deal hole cards
    this.dealHoleCards();
    
    // Post blinds
    this.postBlinds();
    
    // Set game state
    this.gameState.phase = 'PREFLOP';
    this.gameState.communityCards = [];
    this.gameState.currentBet = 50; // Big blind amount
    
    // Set first player to act (after big blind)
    this.setFirstPlayerToAct();
  }

  // Set dealer, small blind, big blind positions
  private setPositions(): void {
    const activePlayers = this.players.filter(p => p.status === 'PLAYING');
    if (activePlayers.length < 2) return;

    // Move dealer button
    let dealerIndex = this.gameState.dealerSeat !== undefined ? this.gameState.dealerSeat : -1;
    do {
      dealerIndex = (dealerIndex + 1) % 9;
    } while (!activePlayers.find(p => p.seatNumber === dealerIndex));

    this.gameState.dealerSeat = dealerIndex;
    
    // Set dealer
    const dealer = activePlayers.find(p => p.seatNumber === dealerIndex);
    if (dealer) dealer.isDealer = true;

    if (activePlayers.length === 2) {
      // Heads up: dealer is small blind
      if (dealer) dealer.isSmallBlind = true;
      const opponent = activePlayers.find(p => p.seatNumber !== dealerIndex);
      if (opponent) opponent.isBigBlind = true;
    } else {
      // Find small blind (next after dealer)
      let sbSeat = dealerIndex;
      do {
        sbSeat = (sbSeat + 1) % 9;
      } while (!activePlayers.find(p => p.seatNumber === sbSeat));
      
      const smallBlind = activePlayers.find(p => p.seatNumber === sbSeat);
      if (smallBlind) smallBlind.isSmallBlind = true;

      // Find big blind (next after small blind)
      let bbSeat = sbSeat;
      do {
        bbSeat = (bbSeat + 1) % 9;
      } while (!activePlayers.find(p => p.seatNumber === bbSeat));
      
      const bigBlind = activePlayers.find(p => p.seatNumber === bbSeat);
      if (bigBlind) bigBlind.isBigBlind = true;
    }
  }

  // Deal 2 hole cards to each player
  private dealHoleCards(): void {
    const activePlayers = this.players.filter(p => p.status === 'PLAYING');
    
    // Deal 2 rounds of cards
    for (let round = 0; round < 2; round++) {
      activePlayers.forEach(player => {
        const card = this.deck.dealCard();
        if (card) {
          if (!player.holeCards) player.holeCards = [];
          player.holeCards.push(card);
        }
      });
    }
  }

  // Post small and big blinds
  private postBlinds(): void {
    const smallBlind = this.players.find(p => p.isSmallBlind);
    const bigBlind = this.players.find(p => p.isBigBlind);
    
    if (smallBlind) {
      const sbAmount = 25; // Small blind
      smallBlind.currentBet = Math.min(sbAmount, smallBlind.stack);
      smallBlind.stack -= smallBlind.currentBet;
      this.gameState.pot += smallBlind.currentBet;
    }
    
    if (bigBlind) {
      const bbAmount = 50; // Big blind
      bigBlind.currentBet = Math.min(bbAmount, bigBlind.stack);
      bigBlind.stack -= bigBlind.currentBet;
      this.gameState.pot += bigBlind.currentBet;
    }
  }

  // Set first player to act after big blind
  private setFirstPlayerToAct(): void {
    const activePlayers = this.players.filter(p => p.status === 'PLAYING');
    if (activePlayers.length === 0) return;

    const bigBlind = this.players.find(p => p.isBigBlind);
    if (!bigBlind) return;

    // Find next player after big blind
    let nextSeat = bigBlind.seatNumber;
    let attempts = 0;
    do {
      nextSeat = (nextSeat + 1) % 9;
      attempts++;
    } while (
      attempts < 9 && 
      !activePlayers.find(p => p.seatNumber === nextSeat)
    );

    const activePlayer = activePlayers.find(p => p.seatNumber === nextSeat);
    if (activePlayer) {
      this.gameState.activeSeat = activePlayer.seatNumber;
      this.gameState.activePlayerId = activePlayer.playerId;
    }
  }

  // Process player action
  processAction(playerId: string, action: string, amount?: number): boolean {
    const player = this.players.find(p => p.playerId === playerId);
    if (!player || this.gameState.activePlayerId !== playerId) {
      return false;
    }

    const callAmount = Math.max(0, this.gameState.currentBet - player.currentBet);

    switch (action) {
      case 'FOLD':
        player.status = 'FOLDED';
        break;

      case 'CHECK':
        if (callAmount > 0) return false;
        break;

      case 'CALL':
        if (callAmount === 0) return false;
        const actualCall = Math.min(callAmount, player.stack);
        player.currentBet += actualCall;
        player.stack -= actualCall;
        this.gameState.pot += actualCall;
        if (player.stack === 0) player.status = 'ALL_IN';
        break;

      case 'BET':
      case 'RAISE':
        if (!amount || amount <= 0) return false;
        if (amount > player.stack) return false;
        
        const totalAmount = amount + callAmount;
        if (totalAmount > player.stack) return false;
        
        player.currentBet += totalAmount;
        player.stack -= totalAmount;
        this.gameState.pot += totalAmount;
        this.gameState.currentBet = player.currentBet;
        if (player.stack === 0) player.status = 'ALL_IN';
        break;

      case 'ALL_IN':
        const allInAmount = player.stack;
        player.currentBet += allInAmount;
        player.stack = 0;
        player.status = 'ALL_IN';
        this.gameState.pot += allInAmount;
        if (player.currentBet > this.gameState.currentBet) {
          this.gameState.currentBet = player.currentBet;
        }
        break;

      default:
        return false;
    }

    // Move to next player or next phase
    if (this.isBettingRoundComplete()) {
      this.advanceToNextPhase();
    } else {
      this.setNextActivePlayer();
    }

    return true;
  }

  // Check if betting round is complete
  private isBettingRoundComplete(): boolean {
    const activePlayers = this.players.filter(p => 
      p.status === 'PLAYING' || p.status === 'ALL_IN'
    );
    
    if (activePlayers.length <= 1) return true;

    const playingPlayers = activePlayers.filter(p => p.status === 'PLAYING');
    if (playingPlayers.length === 0) return true;

    return playingPlayers.every(p => 
      p.currentBet === this.gameState.currentBet || p.stack === 0
    );
  }

  // Advance to next phase
  private advanceToNextPhase(): void {
    // Reset bets for next round
    this.players.forEach(p => p.currentBet = 0);
    this.gameState.currentBet = 0;

    switch (this.gameState.phase) {
      case 'PREFLOP':
        this.dealFlop();
        this.gameState.phase = 'FLOP';
        break;
      case 'FLOP':
        this.dealTurn();
        this.gameState.phase = 'TURN';
        break;
      case 'TURN':
        this.dealRiver();
        this.gameState.phase = 'RIVER';
        break;
      case 'RIVER':
        this.gameState.phase = 'SHOWDOWN';
        return;
    }

    this.setFirstPlayerToActPostFlop();
  }

  // Deal flop (3 cards)
  private dealFlop(): void {
    this.deck.dealCard(); // Burn card
    for (let i = 0; i < 3; i++) {
      const card = this.deck.dealCard();
      if (card) this.gameState.communityCards.push(card);
    }
  }

  // Deal turn (1 card)
  private dealTurn(): void {
    this.deck.dealCard(); // Burn card
    const card = this.deck.dealCard();
    if (card) this.gameState.communityCards.push(card);
  }

  // Deal river (1 card)
  private dealRiver(): void {
    this.deck.dealCard(); // Burn card
    const card = this.deck.dealCard();
    if (card) this.gameState.communityCards.push(card);
  }

  // Set first player to act post-flop (starts with small blind)
  private setFirstPlayerToActPostFlop(): void {
    const activePlayers = this.players.filter(p => p.status === 'PLAYING');
    if (activePlayers.length === 0) return;

    let currentSeat = this.gameState.dealerSeat !== undefined ? this.gameState.dealerSeat : 0;
    let attempts = 0;
    
    do {
      currentSeat = (currentSeat + 1) % 9;
      attempts++;
    } while (
      attempts < 9 && 
      !activePlayers.find(p => p.seatNumber === currentSeat)
    );

    const activePlayer = activePlayers.find(p => p.seatNumber === currentSeat);
    if (activePlayer) {
      this.gameState.activeSeat = activePlayer.seatNumber;
      this.gameState.activePlayerId = activePlayer.playerId;
    }
  }

  // Move to next active player
  private setNextActivePlayer(): void {
    const activePlayers = this.players.filter(p => p.status === 'PLAYING');
    if (activePlayers.length === 0) return;

    let currentSeat = this.gameState.activeSeat !== undefined ? this.gameState.activeSeat : 0;
    let attempts = 0;
    
    do {
      currentSeat = (currentSeat + 1) % 9;
      attempts++;
    } while (
      attempts < 9 && 
      !activePlayers.find(p => p.seatNumber === currentSeat)
    );

    const activePlayer = activePlayers.find(p => p.seatNumber === currentSeat);
    if (activePlayer) {
      this.gameState.activeSeat = activePlayer.seatNumber;
      this.gameState.activePlayerId = activePlayer.playerId;
    }
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  getPlayers(): PlayerState[] {
    return [...this.players];
  }
}
