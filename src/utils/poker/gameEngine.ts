
import { GameState, PlayerState, PlayerAction } from '@/types/poker';
import { BlindsManager } from './engine/blindsManager';
import { PositionManager } from './engine/positionManager';
import { CardManager } from './engine/cardManager';
import { ActionProcessor } from './engine/actionProcessor';
import { ShowdownProcessor } from './engine/showdownProcessor';
import { GameResult } from './engine/types';

export { GameResult } from './engine/types';

export class PokerGameEngine {
  private game: GameState;
  private players: PlayerState[];
  private blindsManager: BlindsManager;
  private positionManager: PositionManager;
  private cardManager: CardManager;
  private actionProcessor: ActionProcessor;
  private showdownProcessor: ShowdownProcessor;

  constructor(gameState: GameState, players: PlayerState[]) {
    this.game = { ...gameState };
    this.players = [...players];
    this.blindsManager = new BlindsManager();
    this.positionManager = new PositionManager();
    this.cardManager = new CardManager();
    this.actionProcessor = new ActionProcessor();
    this.showdownProcessor = new ShowdownProcessor();
  }

  getGameState(): GameState {
    return { ...this.game };
  }

  getPlayers(): PlayerState[] {
    return [...this.players];
  }

  startNewHand(): void {
    // Reset deck and shuffle
    this.cardManager.resetDeck();
    
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
    this.positionManager.assignPositions(this.game, this.players);
    
    // Deal hole cards
    this.cardManager.dealHoleCards(this.players);
    
    // Post blinds
    const smallBlind = this.players.find(p => p.isSmallBlind);
    const bigBlind = this.players.find(p => p.isBigBlind);
    this.blindsManager.postBlinds(this.players, smallBlind, bigBlind);
    
    // Set game state
    this.game.phase = 'PREFLOP';
    this.game.pot = this.blindsManager.getSmallBlind() + this.blindsManager.getBigBlind();
    this.game.currentBet = this.blindsManager.getBigBlind();
    this.game.communityCards = [];
    
    // Set active player (first to act after big blind)
    this.positionManager.setNextActivePlayer(this.game, this.players);
  }

  processAction(playerId: string, action: PlayerAction, amount?: number): boolean {
    const success = this.actionProcessor.processAction(this.game, this.players, playerId, action, amount);
    
    if (!success) return false;

    // Check if betting round is complete
    if (this.actionProcessor.isBettingRoundComplete(this.players)) {
      this.advanceToNextPhase();
    } else {
      this.positionManager.setNextActivePlayer(this.game, this.players);
    }

    return true;
  }

  processShowdown(): GameResult {
    return this.showdownProcessor.processShowdown(this.game, this.players);
  }

  private advanceToNextPhase(): void {
    // Reset current bets for next round
    this.players.forEach(p => p.currentBet = 0);
    this.game.currentBet = 0;

    switch (this.game.phase) {
      case 'PREFLOP':
        this.cardManager.dealFlop(this.game);
        this.game.phase = 'FLOP';
        break;
      case 'FLOP':
        this.cardManager.dealTurn(this.game);
        this.game.phase = 'TURN';
        break;
      case 'TURN':
        this.cardManager.dealRiver(this.game);
        this.game.phase = 'RIVER';
        break;
      case 'RIVER':
        this.game.phase = 'SHOWDOWN';
        return; // Don't set active player for showdown
    }

    // Set first player to act (after dealer)
    this.positionManager.setFirstPlayerToAct(this.game, this.players);
  }
}
