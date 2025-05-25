
import { GameState, PlayerState, GameAction, PlayerAction } from '@/types/poker';
import { PokerGameEngine, GameResult } from '@/utils/poker/gameEngine';

export interface PokerGameStore {
  // State
  game: GameState | null;
  players: PlayerState[];
  actions: GameAction[];
  isLoading: boolean;
  error: string | null;
  playerHandVisible: boolean;
  gameEngine: PokerGameEngine | null;
  
  // Actions
  initializeGame: (tableId: string) => Promise<void>;
  subscribeToGame: (gameId: string) => void;
  unsubscribeFromGame: () => void;
  performAction: (playerId: string, action: PlayerAction, amount?: number) => Promise<void>;
  sitDown: (gameId: string, playerId: string, seatNumber: number, buyIn: number) => Promise<void>;
  leaveTable: (playerId: string) => Promise<void>;
  togglePlayerHandVisibility: () => void;
  startNewHand: () => Promise<void>;
  processGameAction: (playerId: string, action: PlayerAction, amount?: number) => Promise<void>;
  handleShowdown: () => Promise<void>;
}
