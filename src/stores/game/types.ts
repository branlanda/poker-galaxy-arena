
import { GameState, SeatState } from '@/types/game';
import { PlayerAction } from '@/types/lobby';

export interface GameStore {
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  setGameState: (gameState: GameState | null) => void;
  resetGameState: () => void;
  updateGameState: (updates: Partial<GameState>) => void;
  initializeGame: (tableId: string) => Promise<void>;
  disconnectGame: () => void;
  takeSeat: (seatNumber: number, playerId: string, playerName: string, stack: number) => Promise<void>;
  leaveSeat: (playerId: string) => Promise<void>;
  placeBet: (playerId: string, amount: number, action: PlayerAction) => Promise<void>;
}
