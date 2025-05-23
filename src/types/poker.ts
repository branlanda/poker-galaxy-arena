
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
  seatNumber: number;
  stack: number;
  holeCards?: Card[];
  status: PlayerStatus;
  currentBet: number;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
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
  communityCards: Card[];
  currentBet: number;
  lastActionTime: string;
  createdAt: string;
}

// Complete poker table state
export interface TableState {
  game: GameState | null;
  players: PlayerState[];
  actions: GameAction[];
  isLoading: boolean;
  error: string | null;
}
