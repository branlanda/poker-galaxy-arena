
import { supabase } from '@/integrations/supabase/client';
import { GameState } from '@/types/game';

/**
 * Action for a player to leave their seat at the table
 */
export const leaveSeatAction = async (
  gameState: GameState,
  playerId: string
): Promise<GameState> => {
  if (!gameState) return gameState;
  
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
      
    return updatedGameState;
  }
  
  return gameState;
};
