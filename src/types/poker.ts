
import { PlayerAtTable } from "@/types/lobby";

// Card representation
export interface Card {
  suit: 'spades' | 'hearts' | 'diamonds' | 'clubs';
  value: string; // '2', '3', ... 'A'
  code: string; // '2S', 'KH', etc.
  rank?: string; // Optional for backward compatibility with stories
}

// Game phases
export type GamePhase = 'WAITING' | 'PREFLOP' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN';

// Player actions
export type PlayerAction = 'FOLD' | 'CHECK' | 'CALL' | 'BET' | 'RAISE' | 'ALL_IN';

// Player status in the game
export type PlayerStatus = 'SITTING' | 'PLAYING' | 'FOLDED' | 'ALL_IN' | 'AWAY';

// Player state in a game
export interface PlayerState {
  id: string;
  gameId: string;
  playerId: string;
  playerName?: string; // Adding this to match what's used in PlayerSeat
  seatNumber: number;
  stack: number;
  holeCards?: Card[];
  status: PlayerStatus;
  currentBet: number;
  bet?: number; // For compatibility with existing code
  cards?: Card[]; // For compatibility with existing code
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  isFolded?: boolean; // For compatibility with existing views
  isAllIn?: boolean; // For compatibility with existing views
  isWinner?: boolean; // For future use
  winAmount?: number; // For future use
  isActive?: boolean; // For compatibility with existing views
  createdAt: string;
}

// Game action record
export interface GameAction {
  id: string;
  gameId: string;
  playerId: string;
  action: PlayerAction;
  amount?: number;
  createdAt: string;
}

// Game state
export interface GameState {
  id: string;
  tableId: string;
  phase: GamePhase;
  pot: number;
  dealerSeat?: number;
  activeSeat?: number;
  activePlayerId?: string; // Added for compatibility
  communityCards: Card[];
  currentBet: number;
  lastActionTime: string;
  lastAction?: GameAction; // For animation triggers
  seats?: any[]; // For compatibility with existing views
  createdAt: string;
  dealer?: number; // Added for compatibility
  smallBlind?: number; // For game rules
  bigBlind?: number; // For game rules
}

// Complete poker table state
export interface TableState {
  game: GameState | null;
  players: PlayerState[];
  actions: GameAction[];
  isLoading: boolean;
  error: string | null;
}

// Added for compatibility with existing code and stories
export interface SeatState {
  playerId: string;
  playerName: string;
  stack: number;
  bet: number;
  cards?: Card[];
  isActive: boolean;
  isDealer: boolean;
  isSmallBlind?: boolean;
  isBigBlind?: boolean;
  isFolded?: boolean;
  isAllIn?: boolean;
  isWinner?: boolean;
  winAmount?: number;
  status: PlayerStatus;
  lastAction?: PlayerAction;
  currentBet?: number;
}
