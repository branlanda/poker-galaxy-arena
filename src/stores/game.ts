import { create } from 'zustand';
import { GameState } from '@/types/game';
import { supabase } from '@/lib/supabase';

interface GameStore {
  gameState: GameState | null;
  setGameState: (gameState: GameState | null) => void;
  resetGameState: () => void;
  updateGameState: (updates: Partial<GameState>) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: null,
  setGameState: (gameState) => set({ gameState }),
  resetGameState: () => set({ gameState: null }),
  updateGameState: (updates) =>
    set((state) => ({
      gameState: state.gameState ? { ...state.gameState, ...updates } : null,
    })),
}));
