
import { GameState } from '@/types/game';

// Create an empty game state with default values
export const createEmptyGameState = (tableId: string): GameState => ({
  tableId,
  phase: 'WAITING',
  pot: 0,
  currentBet: 0,
  activePlayerId: null,
  dealer: 0,
  smallBlind: 0,
  bigBlind: 0,
  communityCards: [],
  seats: Array(9).fill(null),
  lastAction: null,
});
