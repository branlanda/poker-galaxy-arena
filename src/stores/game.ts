import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { GameState, GamePhase, PlayerAction, Card, SeatState } from '@/types/lobby';

interface GameStore {
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

// Default empty state
const createEmptyGameState = (tableId: string): GameState => ({
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
      
      // No need to return the cleanup function, we handle it in disconnectGame
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
  
  takeSeat: async (seatNumber: number, playerId: string, playerName: string, stack: number) => {
    const { gameState } = get();
    if (!gameState || gameState.seats[seatNumber] !== null) return;
    
    const updatedSeats = [...gameState.seats];
    updatedSeats[seatNumber] = {
      playerId,
      playerName,
      stack,
      bet: 0,
      cards: null,
      isActive: true,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
      isFolded: false,
      isAllIn: false,
      isWinner: false,
    };
    
    const updatedGameState = {
      ...gameState,
      seats: updatedSeats,
    };
    
    // Update local state
    set({ gameState: updatedGameState });
    
    // Broadcast to other players
    await supabase.channel(`game:${gameState.tableId}`).send({
      type: 'broadcast',
      event: 'game_update',
      payload: updatedGameState,
    });
    
    // Update the database
    await supabase
      .from('players_at_table')
      .upsert({
        player_id: playerId,
        table_id: gameState.tableId,
        seat_number: seatNumber,
        stack: stack,
        status: 'SITTING'
      }, { onConflict: 'player_id, table_id' });
  },
  
  leaveSeat: async (playerId: string) => {
    const { gameState } = get();
    if (!gameState) return;
    
    const updatedSeats = [...gameState.seats];
    const seatIndex = updatedSeats.findIndex(
      seat => seat !== null && seat.playerId === playerId
    );
    
    if (seatIndex !== -1) {
      updatedSeats[seatIndex] = null;
      
      const updatedGameState = {
        ...gameState,
        seats: updatedSeats,
      };
      
      // Update local state
      set({ gameState: updatedGameState });
      
      // Broadcast to other players
      await supabase.channel(`game:${gameState.tableId}`).send({
        type: 'broadcast',
        event: 'game_update',
        payload: updatedGameState,
      });
      
      // Update the database
      await supabase
        .from('players_at_table')
        .update({ status: 'LEFT', seat_number: null })
        .eq('player_id', playerId)
        .eq('table_id', gameState.tableId);
    }
  },
  
  placeBet: async (playerId: string, amount: number, action: PlayerAction) => {
    const { gameState } = get();
    if (!gameState) return;
    
    // Find the player's seat
    const seatIndex = gameState.seats.findIndex(
      seat => seat !== null && seat.playerId === playerId
    );
    
    if (seatIndex === -1) return;
    
    const seat = gameState.seats[seatIndex] as SeatState;
    const updatedSeats = [...gameState.seats];
    
    // Update the game state based on the action
    switch (action) {
      case 'FOLD':
        updatedSeats[seatIndex] = { ...seat, isFolded: true };
        break;
      
      case 'CHECK':
        // No changes to bet or stack
        break;
        
      case 'CALL':
        const callAmount = gameState.currentBet - seat.bet;
        if (callAmount <= 0) break;
        
        if (callAmount >= seat.stack) {
          updatedSeats[seatIndex] = {
            ...seat,
            bet: seat.bet + seat.stack,
            stack: 0,
            isAllIn: true
          };
        } else {
          updatedSeats[seatIndex] = {
            ...seat, 
            bet: gameState.currentBet,
            stack: seat.stack - callAmount
          };
        }
        break;
      
      case 'BET':
      case 'RAISE':
        if (amount >= seat.stack) {
          // All-in
          updatedSeats[seatIndex] = {
            ...seat,
            bet: seat.bet + seat.stack,
            stack: 0,
            isAllIn: true
          };
        } else {
          updatedSeats[seatIndex] = {
            ...seat,
            bet: seat.bet + amount,
            stack: seat.stack - amount
          };
        }
        break;
        
      case 'ALL_IN':
        updatedSeats[seatIndex] = {
          ...seat,
          bet: seat.bet + seat.stack,
          stack: 0,
          isAllIn: true
        };
        break;
    }
    
    // Calculate new pot and current bet
    const newPot = updatedSeats.reduce(
      (total, seat) => total + (seat?.bet || 0),
      0
    );
    
    const newCurrentBet = Math.max(
      gameState.currentBet,
      updatedSeats[seatIndex]?.bet || 0
    );
    
    const updatedGameState = {
      ...gameState,
      seats: updatedSeats,
      pot: newPot,
      currentBet: newCurrentBet,
      lastAction: {
        playerId,
        action,
        amount: action === 'BET' || action === 'RAISE' ? amount : undefined
      }
    };
    
    // Update local state
    set({ gameState: updatedGameState });
    
    // Broadcast to other players
    await supabase.channel(`game:${gameState.tableId}`).send({
      type: 'broadcast',
      event: 'game_update',
      payload: updatedGameState,
    });
  }
}));
