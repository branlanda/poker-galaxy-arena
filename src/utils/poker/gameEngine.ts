
import { Card, GamePhase, PlayerAction, PlayerState, GameState } from '@/types/poker';
import { Deck } from './deck';
import { evaluateHand, compareHands, HandRank } from './handEvaluator';

export interface SidePot {
  amount: number;
  eligiblePlayers: string[];
}

export interface GameResult {
  winners: Array<{
    playerId: string;
    handRank: HandRank;
    winAmount: number;
    sidePotIndex?: number;
  }>;
  sidePots: SidePot[];
}

export class PokerGameEngine {
  private deck: Deck;
  private gameState: GameState;
  private players: Map<string, PlayerState>;

  constructor(gameState: GameState, players: PlayerState[]) {
    this.deck = new Deck();
    this.gameState = { ...gameState };
    this.players = new Map();
    
    players.forEach(player => {
      this.players.set(player.playerId, { ...player });
    });
  }

  // Iniciar nueva mano
  startNewHand(): void {
    this.deck.reset();
    this.gameState.phase = 'PREFLOP';
    this.gameState.pot = 0;
    this.gameState.currentBet = 0;
    this.gameState.communityCards = [];
    
    // Resetear estados de jugadores
    this.players.forEach(player => {
      if (player.stack > 0) {
        player.status = 'PLAYING';
        player.currentBet = 0;
        player.holeCards = [];
      }
    });
    
    // Determinar dealer, blinds
    this.setPositions();
    
    // Repartir cartas
    this.dealHoleCards();
    
    // Apostar blinds
    this.postBlinds();
    
    // Establecer primer jugador activo
    this.setNextActivePlayer();
  }

  private setPositions(): void {
    const activePlayers = Array.from(this.players.values())
      .filter(p => p.stack > 0)
      .sort((a, b) => a.seatNumber - b.seatNumber);
    
    if (activePlayers.length < 2) return;
    
    // Rotar dealer
    const currentDealerIndex = activePlayers.findIndex(p => p.isDealer);
    const nextDealerIndex = (currentDealerIndex + 1) % activePlayers.length;
    
    // Reset positions
    this.players.forEach(player => {
      player.isDealer = false;
      player.isSmallBlind = false;
      player.isBigBlind = false;
    });
    
    // Set new positions
    activePlayers[nextDealerIndex].isDealer = true;
    this.gameState.dealerSeat = activePlayers[nextDealerIndex].seatNumber;
    
    if (activePlayers.length === 2) {
      // Heads up: dealer es small blind
      activePlayers[nextDealerIndex].isSmallBlind = true;
      activePlayers[(nextDealerIndex + 1) % 2].isBigBlind = true;
    } else {
      // Multi-player
      activePlayers[(nextDealerIndex + 1) % activePlayers.length].isSmallBlind = true;
      activePlayers[(nextDealerIndex + 2) % activePlayers.length].isBigBlind = true;
    }
  }

  private dealHoleCards(): void {
    const activePlayers = Array.from(this.players.values())
      .filter(p => p.status === 'PLAYING');
    
    // Repartir 2 cartas a cada jugador
    for (let round = 0; round < 2; round++) {
      for (const player of activePlayers) {
        const card = this.deck.dealCard();
        if (card) {
          player.holeCards = player.holeCards || [];
          player.holeCards.push(card);
        }
      }
    }
  }

  private postBlinds(): void {
    const smallBlindPlayer = Array.from(this.players.values())
      .find(p => p.isSmallBlind);
    const bigBlindPlayer = Array.from(this.players.values())
      .find(p => p.isBigBlind);
    
    if (smallBlindPlayer) {
      const smallBlindAmount = Math.min(this.gameState.smallBlind || 5, smallBlindPlayer.stack);
      this.forceBet(smallBlindPlayer.playerId, smallBlindAmount);
    }
    
    if (bigBlindPlayer) {
      const bigBlindAmount = Math.min(this.gameState.bigBlind || 10, bigBlindPlayer.stack);
      this.forceBet(bigBlindPlayer.playerId, bigBlindAmount);
      this.gameState.currentBet = bigBlindAmount;
    }
  }

  private forceBet(playerId: string, amount: number): void {
    const player = this.players.get(playerId);
    if (!player) return;
    
    const actualAmount = Math.min(amount, player.stack);
    player.stack -= actualAmount;
    player.currentBet += actualAmount;
    this.gameState.pot += actualAmount;
    
    if (player.stack === 0) {
      player.status = 'ALL_IN';
    }
  }

  // Procesar acción del jugador
  processAction(playerId: string, action: PlayerAction, amount?: number): boolean {
    const player = this.players.get(playerId);
    if (!player || this.gameState.activeSeat !== player.seatNumber) {
      return false;
    }

    switch (action) {
      case 'FOLD':
        return this.processFold(playerId);
      case 'CHECK':
        return this.processCheck(playerId);
      case 'CALL':
        return this.processCall(playerId);
      case 'BET':
      case 'RAISE':
        return this.processBetOrRaise(playerId, amount || 0);
      case 'ALL_IN':
        return this.processAllIn(playerId);
      default:
        return false;
    }
  }

  private processFold(playerId: string): boolean {
    const player = this.players.get(playerId);
    if (!player) return false;
    
    player.status = 'FOLDED';
    this.advanceToNextPlayer();
    return true;
  }

  private processCheck(playerId: string): boolean {
    const player = this.players.get(playerId);
    if (!player || player.currentBet < this.gameState.currentBet) {
      return false; // No puede check si hay apuesta pendiente
    }
    
    this.advanceToNextPlayer();
    return true;
  }

  private processCall(playerId: string): boolean {
    const player = this.players.get(playerId);
    if (!player) return false;
    
    const callAmount = this.gameState.currentBet - player.currentBet;
    if (callAmount <= 0) return false;
    
    const actualAmount = Math.min(callAmount, player.stack);
    player.stack -= actualAmount;
    player.currentBet += actualAmount;
    this.gameState.pot += actualAmount;
    
    if (player.stack === 0) {
      player.status = 'ALL_IN';
    }
    
    this.advanceToNextPlayer();
    return true;
  }

  private processBetOrRaise(playerId: string, amount: number): boolean {
    const player = this.players.get(playerId);
    if (!player || amount <= 0) return false;
    
    const totalBet = player.currentBet + amount;
    
    // Validar que la apuesta sea válida
    if (totalBet <= this.gameState.currentBet) return false;
    if (amount > player.stack) return false;
    
    player.stack -= amount;
    player.currentBet += amount;
    this.gameState.pot += amount;
    this.gameState.currentBet = player.currentBet;
    
    if (player.stack === 0) {
      player.status = 'ALL_IN';
    }
    
    this.advanceToNextPlayer();
    return true;
  }

  private processAllIn(playerId: string): boolean {
    const player = this.players.get(playerId);
    if (!player || player.stack === 0) return false;
    
    const allInAmount = player.stack;
    player.stack = 0;
    player.currentBet += allInAmount;
    this.gameState.pot += allInAmount;
    player.status = 'ALL_IN';
    
    if (player.currentBet > this.gameState.currentBet) {
      this.gameState.currentBet = player.currentBet;
    }
    
    this.advanceToNextPlayer();
    return true;
  }

  private advanceToNextPlayer(): void {
    if (this.isRoundComplete()) {
      this.advanceToNextPhase();
    } else {
      this.setNextActivePlayer();
    }
  }

  private setNextActivePlayer(): void {
    const activePlayers = Array.from(this.players.values())
      .filter(p => p.status === 'PLAYING' || p.status === 'ALL_IN')
      .sort((a, b) => a.seatNumber - b.seatNumber);
    
    if (activePlayers.length === 0) return;
    
    const currentIndex = activePlayers.findIndex(p => p.seatNumber === this.gameState.activeSeat);
    let nextIndex = (currentIndex + 1) % activePlayers.length;
    
    // Encontrar siguiente jugador que puede actuar
    let attempts = 0;
    while (attempts < activePlayers.length) {
      const nextPlayer = activePlayers[nextIndex];
      if (nextPlayer.status === 'PLAYING') {
        this.gameState.activeSeat = nextPlayer.seatNumber;
        return;
      }
      nextIndex = (nextIndex + 1) % activePlayers.length;
      attempts++;
    }
    
    // No hay jugadores que puedan actuar
    this.gameState.activeSeat = undefined;
  }

  private isRoundComplete(): boolean {
    const playingPlayers = Array.from(this.players.values())
      .filter(p => p.status === 'PLAYING');
    
    if (playingPlayers.length <= 1) return true;
    
    // Verificar si todos los jugadores han igualado la apuesta actual
    return playingPlayers.every(p => p.currentBet === this.gameState.currentBet);
  }

  private advanceToNextPhase(): void {
    // Reset bets for next round
    this.players.forEach(player => {
      player.currentBet = 0;
    });
    this.gameState.currentBet = 0;
    
    switch (this.gameState.phase) {
      case 'PREFLOP':
        this.gameState.phase = 'FLOP';
        this.dealFlop();
        break;
      case 'FLOP':
        this.gameState.phase = 'TURN';
        this.dealTurn();
        break;
      case 'TURN':
        this.gameState.phase = 'RIVER';
        this.dealRiver();
        break;
      case 'RIVER':
        this.gameState.phase = 'SHOWDOWN';
        this.processShowdown();
        return;
    }
    
    this.setFirstPlayerToAct();
  }

  private dealFlop(): void {
    // Burn card
    this.deck.dealCard();
    
    // Deal 3 community cards
    for (let i = 0; i < 3; i++) {
      const card = this.deck.dealCard();
      if (card) {
        this.gameState.communityCards.push(card);
      }
    }
  }

  private dealTurn(): void {
    // Burn card
    this.deck.dealCard();
    
    // Deal 1 community card
    const card = this.deck.dealCard();
    if (card) {
      this.gameState.communityCards.push(card);
    }
  }

  private dealRiver(): void {
    // Burn card
    this.deck.dealCard();
    
    // Deal 1 community card
    const card = this.deck.dealCard();
    if (card) {
      this.gameState.communityCards.push(card);
    }
  }

  private setFirstPlayerToAct(): void {
    const activePlayers = Array.from(this.players.values())
      .filter(p => p.status === 'PLAYING')
      .sort((a, b) => a.seatNumber - b.seatNumber);
    
    if (activePlayers.length === 0) return;
    
    // Encontrar primer jugador después del dealer
    const dealerSeat = this.gameState.dealerSeat || 0;
    const playerAfterDealer = activePlayers.find(p => p.seatNumber > dealerSeat) || activePlayers[0];
    
    this.gameState.activeSeat = playerAfterDealer.seatNumber;
  }

  private processShowdown(): GameResult {
    const activePlayers = Array.from(this.players.values())
      .filter(p => p.status !== 'FOLDED');
    
    if (activePlayers.length === 1) {
      // Solo un jugador queda, gana el pot
      const winner = activePlayers[0];
      winner.stack += this.gameState.pot;
      
      return {
        winners: [{
          playerId: winner.playerId,
          handRank: { rank: 0, name: 'Winner by default', cards: [], kickers: [] },
          winAmount: this.gameState.pot
        }],
        sidePots: []
      };
    }
    
    // Calcular side pots
    const sidePots = this.calculateSidePots();
    const winners: GameResult['winners'] = [];
    
    // Evaluar manos para cada side pot
    for (let i = 0; i < sidePots.length; i++) {
      const sidePot = sidePots[i];
      const eligiblePlayers = sidePot.eligiblePlayers
        .map(id => this.players.get(id))
        .filter(Boolean) as PlayerState[];
      
      // Evaluar manos
      const playerHands = eligiblePlayers.map(player => ({
        player,
        handRank: evaluateHand(player.holeCards || [], this.gameState.communityCards)
      }));
      
      // Encontrar ganadores
      playerHands.sort((a, b) => compareHands(b.handRank, a.handRank));
      const bestRank = playerHands[0].handRank;
      const sidePotWinners = playerHands.filter(ph => 
        compareHands(ph.handRank, bestRank) === 0
      );
      
      // Distribuir side pot
      const winAmountPerPlayer = sidePot.amount / sidePotWinners.length;
      
      sidePotWinners.forEach(({ player, handRank }) => {
        player.stack += winAmountPerPlayer;
        winners.push({
          playerId: player.playerId,
          handRank,
          winAmount: winAmountPerPlayer,
          sidePotIndex: i
        });
      });
    }
    
    return { winners, sidePots };
  }

  private calculateSidePots(): SidePot[] {
    const activePlayers = Array.from(this.players.values())
      .filter(p => p.status !== 'FOLDED');
    
    if (activePlayers.length === 0) return [];
    
    // Ordenar por apuesta total (menor a mayor)
    const playerBets = activePlayers
      .map(p => ({ playerId: p.playerId, totalBet: p.currentBet }))
      .sort((a, b) => a.totalBet - b.totalBet);
    
    const sidePots: SidePot[] = [];
    let currentBetLevel = 0;
    
    for (let i = 0; i < playerBets.length; i++) {
      const betLevel = playerBets[i].totalBet;
      
      if (betLevel > currentBetLevel) {
        const eligiblePlayers = playerBets
          .slice(i)
          .map(pb => pb.playerId);
        
        const potAmount = (betLevel - currentBetLevel) * eligiblePlayers.length;
        
        sidePots.push({
          amount: potAmount,
          eligiblePlayers
        });
        
        currentBetLevel = betLevel;
      }
    }
    
    return sidePots;
  }

  // Getters
  getGameState(): GameState {
    return { ...this.gameState };
  }

  getPlayers(): PlayerState[] {
    return Array.from(this.players.values());
  }

  getActivePlayer(): PlayerState | undefined {
    return Array.from(this.players.values())
      .find(p => p.seatNumber === this.gameState.activeSeat);
  }
}
