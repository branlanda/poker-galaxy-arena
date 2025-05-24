
import { create } from 'zustand';
import { GameState, SeatState } from '@/types/game';
import { supabase } from '@/lib/supabase';
import { PlayerAction } from '@/types/lobby';
import { takeSeatAction, leaveSeatAction, placeBetAction } from './gameActions';

interface GameStore {
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
      
      // Fetch the current game state
      const { data, error } = await supabase
        .from('table_games')
        .select('*')
        .eq('table_id', tableId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // No game found, create a new one
          const { data: newGame, error: createError } = await supabase
            .from('table_games')
            .insert({ table_id: tableId })
            .select()
            .single();
            
          if (createError) throw createError;
          
          // Get player states
          const { data: playersData, error: playersError } = await supabase
            .from('table_player_states')
            .select('*')
            .eq('game_id', newGame.id);
            
          if (playersError) throw playersError;
          
          // Initialize seats array
          const seats = Array(9).fill(null);
          
          // Fill seats with players
          playersData?.forEach((player) => {
            if (player.seat_number !== null && player.seat_number >= 0 && player.seat_number < 9) {
              seats[player.seat_number] = {
                playerId: player.player_id,
                playerName: player.player_name || 'Player',
                stack: player.stack,
                bet: player.current_bet || 0,
                cards: player.hole_cards || null,
                isActive: player.status === 'PLAYING',
                isDealer: player.is_dealer,
                isSmallBlind: player.is_small_blind,
                isBigBlind: player.is_big_blind,
                isFolded: player.status === 'FOLDED',
                isAllIn: player.status === 'ALL_IN',
                isWinner: false
              };
            }
          });
          
          set({
            gameState: {
              tableId,
              phase: newGame.phase,
              pot: newGame.pot,
              currentBet: newGame.current_bet,
              activePlayerId: null,
              dealer: newGame.dealer_seat || 0,
              smallBlind: 5, // Default values
              bigBlind: 10, // Default values
              communityCards: newGame.community_cards || [],
              seats,
              lastAction: null
            },
            isLoading: false
          });
        } else {
          throw error;
        }
      } else {
        // Game found, load player states
        const { data: playersData, error: playersError } = await supabase
          .from('table_player_states')
          .select('*')
          .eq('game_id', data.id);
          
        if (playersError) throw playersError;
        
        // Initialize seats array
        const seats = Array(9).fill(null);
        
        // Fill seats with players
        playersData?.forEach((player) => {
          if (player.seat_number !== null && player.seat_number >= 0 && player.seat_number < 9) {
            seats[player.seat_number] = {
              playerId: player.player_id,
              playerName: player.player_name || 'Player',
              stack: player.stack,
              bet: player.current_bet || 0,
              cards: player.hole_cards || null,
              isActive: player.status === 'PLAYING',
              isDealer: player.is_dealer,
              isSmallBlind: player.is_small_blind,
              isBigBlind: player.is_big_blind,
              isFolded: player.status === 'FOLDED',
              isAllIn: player.status === 'ALL_IN',
              isWinner: false
            };
          }
        });
        
        // Set up active player ID based on active seat
        const activePlayerId = data.active_seat !== null && seats[data.active_seat] 
          ? seats[data.active_seat].playerId 
          : null;
        
        set({
          gameState: {
            tableId,
            phase: data.phase,
            pot: data.pot,
            currentBet: data.current_bet,
            activePlayerId,
            dealer: data.dealer_seat || 0,
            smallBlind: 5, // Default values, should be fetched from table settings
            bigBlind: 10, // Default values, should be fetched from table settings
            communityCards: data.community_cards || [],
            seats,
            lastAction: null
          },
          isLoading: false
        });
      }
      
      // Subscribe to real-time updates
      const channel = supabase.channel(`game:${tableId}`)
        .on('broadcast', { event: 'game_update' }, ({ payload }) => {
          set({ gameState: payload });
        })
        .subscribe();
        
      // Clean up function stored in state to be called on disconnectGame
      set((state) => ({ 
        ...state, 
        cleanup: () => {
          channel.unsubscribe();
        } 
      }));
      
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
