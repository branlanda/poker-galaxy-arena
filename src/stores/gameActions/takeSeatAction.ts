
import { supabase } from '@/integrations/supabase/client';
import { GameState } from '@/types/game';

/**
 * Action for a player to take a seat at the table
 */
export const takeSeatAction = async (
  gameState: GameState, 
  seatNumber: number, 
  playerId: string, 
  playerName: string, 
  stack: number
): Promise<GameState> => {
  if (!gameState || gameState.seats[seatNumber] !== null) return gameState;
  
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
    
  return updatedGameState;
};
