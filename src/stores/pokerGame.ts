
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { GameAction, GameState, PlayerState, PlayerAction } from '@/types/poker';
import { toast } from '@/hooks/use-toast';

interface PokerGameStore {
  // State
  game: GameState | null;
  players: PlayerState[];
  actions: GameAction[];
  isLoading: boolean;
  error: string | null;
  playerHandVisible: boolean;
  
  // Actions
  initializeGame: (tableId: string) => Promise<void>;
  subscribeToGame: (gameId: string) => void;
  unsubscribeFromGame: () => void;
  performAction: (playerId: string, action: PlayerAction, amount?: number) => Promise<void>;
  sitDown: (gameId: string, playerId: string, seatNumber: number, buyIn: number) => Promise<void>;
  leaveTable: (playerId: string) => Promise<void>;
  togglePlayerHandVisibility: () => void;
}

// Helper to map DB response to our frontend model
const mapGameStateFromDb = (data: any): GameState => {
  return {
    id: data.id,
    tableId: data.table_id,
    phase: data.phase,
    pot: data.pot,
    dealerSeat: data.dealer_seat,
    activeSeat: data.active_seat,
    communityCards: data.community_cards || [],
    currentBet: data.current_bet,
    lastActionTime: data.last_action_time,
    createdAt: data.created_at
  };
};

const mapPlayerStateFromDb = (data: any): PlayerState => {
  return {
    id: data.id,
    gameId: data.game_id,
    playerId: data.player_id,
    seatNumber: data.seat_number,
    stack: data.stack,
    holeCards: data.hole_cards,
    status: data.status,
    currentBet: data.current_bet,
    isDealer: data.is_dealer,
    isSmallBlind: data.is_small_blind,
    isBigBlind: data.is_big_blind,
    createdAt: data.created_at
  };
};

const mapGameActionFromDb = (data: any): GameAction => {
  return {
    id: data.id,
    gameId: data.game_id,
    playerId: data.player_id,
    action: data.action,
    amount: data.amount,
    createdAt: data.created_at
  };
};

export const usePokerGameStore = create<PokerGameStore>((set, get) => {
  // Variable to store channel subscriptions
  let gameChannel: any = null;
  let playersChannel: any = null;
  let actionsChannel: any = null;
  
  return {
    // Initial state
    game: null,
    players: [],
    actions: [],
    isLoading: false,
    error: null,
    playerHandVisible: true,
    
    initializeGame: async (tableId: string) => {
      try {
        set({ isLoading: true, error: null });
        
        // Check if a game exists for this table
        const { data: existingGame, error: gameError } = await supabase
          .from('table_games')
          .select('*')
          .eq('table_id', tableId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (gameError && gameError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw gameError;
        }
        
        let gameId;
        
        if (existingGame) {
          // Use existing game
          set({ game: mapGameStateFromDb(existingGame) });
          gameId = existingGame.id;
        } else {
          // Create a new game
          const { data: newGame, error: createError } = await supabase
            .from('table_games')
            .insert({
              table_id: tableId,
              phase: 'WAITING',
              pot: 0,
              current_bet: 0
            })
            .select()
            .single();
            
          if (createError) throw createError;
          
          set({ game: mapGameStateFromDb(newGame) });
          gameId = newGame.id;
        }
        
        // Get player states
        const { data: playerStates, error: playersError } = await supabase
          .from('table_player_states')
          .select('*')
          .eq('game_id', gameId);
          
        if (playersError) throw playersError;
        
        set({ players: playerStates.map(mapPlayerStateFromDb) });
        
        // Get recent actions
        const { data: recentActions, error: actionsError } = await supabase
          .from('table_actions')
          .select('*')
          .eq('game_id', gameId)
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (actionsError) throw actionsError;
        
        set({ 
          actions: recentActions.map(mapGameActionFromDb),
          isLoading: false
        });
        
        // Set up real-time subscriptions
        get().subscribeToGame(gameId);
        
      } catch (error: any) {
        console.error('Error initializing game:', error);
        set({ 
          error: error.message || 'Failed to initialize game',
          isLoading: false
        });
        toast({
          title: 'Error',
          description: error.message || 'Failed to initialize game',
          variant: 'destructive',
        });
      }
    },
    
    subscribeToGame: (gameId: string) => {
      // Clean up any existing subscriptions
      get().unsubscribeFromGame();
      
      // Subscribe to game state changes
      gameChannel = supabase
        .channel(`game-state-${gameId}`)
        .on(
          'postgres_changes',
          { 
            event: 'UPDATE',
            schema: 'public',
            table: 'table_games',
            filter: `id=eq.${gameId}`
          },
          (payload) => {
            set({ game: mapGameStateFromDb(payload.new) });
          }
        )
        .subscribe();
      
      // Subscribe to player state changes
      playersChannel = supabase
        .channel(`player-states-${gameId}`)
        .on(
          'postgres_changes',
          { 
            event: '*',
            schema: 'public',
            table: 'table_player_states',
            filter: `game_id=eq.${gameId}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              set((state) => ({ 
                players: [...state.players, mapPlayerStateFromDb(payload.new)]
              }));
            } else if (payload.eventType === 'UPDATE') {
              set((state) => ({
                players: state.players.map(player => 
                  player.id === payload.new.id ? mapPlayerStateFromDb(payload.new) : player
                )
              }));
            } else if (payload.eventType === 'DELETE') {
              set((state) => ({
                players: state.players.filter(player => player.id !== payload.old.id)
              }));
            }
          }
        )
        .subscribe();
      
      // Subscribe to new game actions
      actionsChannel = supabase
        .channel(`game-actions-${gameId}`)
        .on(
          'postgres_changes',
          { 
            event: 'INSERT',
            schema: 'public',
            table: 'table_actions',
            filter: `game_id=eq.${gameId}`
          },
          (payload) => {
            set((state) => ({
              actions: [mapGameActionFromDb(payload.new), ...state.actions].slice(0, 50)
            }));
            
            // Show toast notification for new actions
            const action = mapGameActionFromDb(payload.new);
            toast({
              title: 'Player Action',
              description: `Player performed ${action.action}${action.amount ? ` with amount ${action.amount}` : ''}`,
              duration: 3000,
            });
          }
        )
        .subscribe();
    },
    
    unsubscribeFromGame: () => {
      // Clean up all subscriptions
      if (gameChannel) supabase.removeChannel(gameChannel);
      if (playersChannel) supabase.removeChannel(playersChannel);
      if (actionsChannel) supabase.removeChannel(actionsChannel);
      
      gameChannel = null;
      playersChannel = null;
      actionsChannel = null;
    },
    
    performAction: async (playerId: string, action: PlayerAction, amount: number = 0) => {
      try {
        const { game } = get();
        if (!game) {
          throw new Error('No active game');
        }
        
        const { error } = await supabase.rpc('perform_game_action', {
          p_game_id: game.id,
          p_player_id: playerId,
          p_action: action,
          p_amount: amount
        });
        
        if (error) throw error;
        
      } catch (error: any) {
        console.error('Error performing action:', error);
        toast({
          title: 'Action Failed',
          description: error.message || 'Failed to perform action',
          variant: 'destructive',
        });
      }
    },
    
    sitDown: async (gameId: string, playerId: string, seatNumber: number, buyIn: number) => {
      try {
        // Check if the seat is already taken
        const { data: existingSeat, error: seatCheckError } = await supabase
          .from('table_player_states')
          .select('*')
          .eq('game_id', gameId)
          .eq('seat_number', seatNumber)
          .single();
          
        if (existingSeat) {
          throw new Error('This seat is already taken');
        }
        
        // Add player to the table
        const { error: sitDownError } = await supabase
          .from('table_player_states')
          .insert({
            game_id: gameId,
            player_id: playerId,
            seat_number: seatNumber,
            stack: buyIn,
            status: 'SITTING'
          });
          
        if (sitDownError) throw sitDownError;
        
      } catch (error: any) {
        console.error('Error sitting down:', error);
        toast({
          title: 'Failed to Take Seat',
          description: error.message || 'Could not sit at the table',
          variant: 'destructive',
        });
      }
    },
    
    leaveTable: async (playerId: string) => {
      try {
        const { game, players } = get();
        if (!game) {
          throw new Error('No active game');
        }
        
        const playerState = players.find(p => p.playerId === playerId);
        if (!playerState) {
          throw new Error('You are not at this table');
        }
        
        // Remove player from the table
        const { error } = await supabase
          .from('table_player_states')
          .delete()
          .eq('id', playerState.id);
          
        if (error) throw error;
        
      } catch (error: any) {
        console.error('Error leaving table:', error);
        toast({
          title: 'Failed to Leave Table',
          description: error.message || 'Could not leave the table',
          variant: 'destructive',
        });
      }
    },
    
    togglePlayerHandVisibility: () => {
      set((state) => ({
        playerHandVisible: !state.playerHandVisible
      }));
    }
  };
});
