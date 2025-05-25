
import { create } from 'zustand';
import { GameStore } from './types';
import { initializeGameState } from './initialization';
import { setupGameSubscription } from './subscriptions';
import { takeSeatAction, leaveSeatAction, placeBetAction } from '../gameActions';

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  isLoading: false,
  error: null,
  
  setGameState: (gameState) => set({ gameState }),
  resetGameState: () => set({ gameState: null }),
  
  updateGameState: (updates) =>
    set((state) => ({
      gameState: state.gameState ? { ...state.gameState, ...updates } : null,
    })),
  
  initializeGame: async (tableId) => {
    try {
      set({ isLoading: true, error: null });
      
      const gameState = await initializeGameState(tableId);
      set({ gameState, isLoading: false });
      
      // Subscribe to real-time updates
      const cleanup = setupGameSubscription(tableId, (payload) => {
        set({ gameState: payload });
      });
      
      // Store cleanup function
      (set as any).cleanup = cleanup;
      
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  disconnectGame: () => {
    const state = get();
    if ('cleanup' in state && typeof (state as any).cleanup === 'function') {
      (state as any).cleanup();
    }
    set({ gameState: null });
  },
  
  takeSeat: async (seatNumber, playerId, playerName, stack) => {
    try {
      const { gameState } = get();
      if (!gameState) return;
      
      const updatedGameState = await takeSeatAction(
        gameState, 
        seatNumber, 
        playerId, 
        playerName, 
        stack
      );
      
      set({ gameState: updatedGameState });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  leaveSeat: async (playerId) => {
    try {
      const { gameState } = get();
      if (!gameState) return;
      
      const updatedGameState = await leaveSeatAction(gameState, playerId);
      set({ gameState: updatedGameState });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  placeBet: async (playerId, amount, action) => {
    try {
      const { gameState } = get();
      if (!gameState) return;
      
      const updatedGameState = await placeBetAction(gameState, playerId, amount, action);
      set({ gameState: updatedGameState });
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
