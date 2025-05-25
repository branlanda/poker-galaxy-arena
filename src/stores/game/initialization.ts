
import { supabase } from '@/lib/supabase';
import { GameState, SeatState } from '@/types/game';

export const initializeGameState = async (tableId: string): Promise<GameState> => {
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
      
      return buildGameState(tableId, newGame, playersData || []);
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
    
    return buildGameState(tableId, data, playersData || []);
  }
};

const buildGameState = (tableId: string, gameData: any, playersData: any[]): GameState => {
  // Initialize seats array
  const seats: (SeatState | null)[] = Array(9).fill(null);
  
  // Fill seats with players
  playersData.forEach((player) => {
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
  const activePlayerId = gameData.active_seat !== null && seats[gameData.active_seat] 
    ? seats[gameData.active_seat]!.playerId 
    : null;
  
  return {
    tableId,
    phase: gameData.phase,
    pot: gameData.pot,
    currentBet: gameData.current_bet,
    activePlayerId,
    dealer: gameData.dealer_seat || 0,
    smallBlind: 5, // Default values, should be fetched from table settings
    bigBlind: 10, // Default values, should be fetched from table settings
    communityCards: gameData.community_cards || [],
    seats,
    lastAction: null
  };
};
