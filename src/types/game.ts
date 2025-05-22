
import { GamePhase, PlayerAction, Card } from '@/types/lobby';

// Define additional types needed for the game store
export interface SeatState {
  playerId: string;
  playerName: string;
  stack: number;
  bet: number;
  cards: Card[] | null;
  isActive: boolean;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  isFolded: boolean;
  isAllIn: boolean;
  isWinner: boolean;
  winAmount?: number;
}

export interface GameState {
  tableId: string;
  phase: GamePhase;
  pot: number;
  currentBet: number;
  activePlayerId: string | null;
  dealer: number;
  smallBlind: number;
  bigBlind: number;
  communityCards: Card[];
  seats: (SeatState | null)[];
  lastAction: {
    playerId: string;
    action: PlayerAction;
    amount?: number;
  } | null;
}

export interface GameStore {
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  
  // Initialize and connect
  initializeGame: (tableId: string) => Promise<void>;
  disconnectGame: () => void;
  
  // Game actions
  takeSeat: (seatNumber: number, playerId: string, playerName: string, stack: number) => Promise<void>;
  leaveSeat: (playerId: string) => Promise<void>;
  placeBet: (playerId: string, amount: number, action: PlayerAction) => Promise<void>;
}
