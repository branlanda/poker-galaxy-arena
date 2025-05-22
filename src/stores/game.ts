
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { GameStore, GameState } from '@/types/game';
import { createEmptyGameState } from '@/utils/gameStateUtils';
import { takeSeatAction, leaveSeatAction, placeBetAction } from '@/stores/gameActions';
import { PlayerAction } from '@/types/lobby';

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  isLoading: true,
  error: null,
  
  initializeGame: async (tableId: string) => {
    set({ isLoading: true, error: null });
    try {
      // First, fetch the table details to get blinds
      const { data: tableData, error: tableError } = await supabase
        .from('lobby_tables')
        .select('*')
        .eq('id', tableId)
        .single();
        
      if (tableError) throw tableError;
      
      // Create initial game state
      const initialGameState = createEmptyGameState(tableId);
      initialGameState.smallBlind = tableData.small_blind;
      initialGameState.bigBlind = tableData.big_blind;
      
      // Get players at the table
      const { data: playersData, error: playersError } = await supabase
        .from('players_at_table')
        .select('*')
        .eq('table_id', tableId);
        
      if (playersError) throw playersError;
      
      // Place players in seats
      playersData.forEach(player => {
        if (player.seat_number !== null && player.status !== 'LEFT') {
          initialGameState.seats[player.seat_number] = {
            playerId: player.player_id,
            playerName: `Player ${player.player_id.substring(0, 4)}`,
            stack: player.stack,
            bet: 0,
            cards: null,
            isActive: player.status === 'ACTIVE',
            isDealer: false,
            isSmallBlind: false,
            isBigBlind: false,
            isFolded: false,
            isAllIn: false,
            isWinner: false,
          };
        }
      });
      
      set({ gameState: initialGameState, isLoading: false });
      
      // Set up real-time subscriptions for game updates
      const gameChannel = supabase.channel(`game:${tableId}`)
        .on('broadcast', { event: 'game_update' }, (payload) => {
          set({ gameState: payload.payload as GameState });
        })
        .subscribe();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  disconnectGame: () => {
    // Clean up any subscriptions here
    const { gameState } = get();
    if (gameState) {
      supabase.removeChannel(supabase.channel(`game:${gameState.tableId}`));
    }
    set({ gameState: null });
  },
  
  takeSeat: async (seatNumber, playerId, playerName, stack) => {
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
  },
  
  leaveSeat: async (playerId) => {
    const { gameState } = get();
    if (!gameState) return;
    
    const updatedGameState = await leaveSeatAction(gameState, playerId);
    set({ gameState: updatedGameState });
  },
  
  placeBet: async (playerId, amount, action) => {
    const { gameState } = get();
    if (!gameState) return;
    
    const updatedGameState = await placeBetAction(
      gameState,
      playerId,
      amount,
      action
    );
    
    set({ gameState: updatedGameState });
  }
}));
