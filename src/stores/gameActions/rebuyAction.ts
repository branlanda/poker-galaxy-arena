
import { supabase } from '@/lib/supabase';
import { GameState } from '@/types/game';
import { useWalletStore } from '@/stores/wallet';

/**
 * Action for a player to add funds to their stack while at the table
 */
export const rebuyAction = async (
  gameState: GameState,
  playerId: string,
  amount: number
): Promise<GameState> => {
  if (!gameState) return gameState;
  
  // Find player's seat
  const updatedSeats = [...gameState.seats];
  const seatIndex = updatedSeats.findIndex(
    seat => seat !== null && seat.playerId === playerId
  );
  
  if (seatIndex === -1) return gameState;
  
  // Verify wallet has sufficient balance
  const { balance } = useWalletStore.getState();
  if (balance < amount) {
    throw new Error('Insufficient balance for rebuy');
  }
  
  // Update player stack
  const updatedSeat = { 
    ...updatedSeats[seatIndex],
    stack: updatedSeats[seatIndex].stack + amount 
  };
  updatedSeats[seatIndex] = updatedSeat;
  
  const updatedGameState = {
    ...gameState,
    seats: updatedSeats
  };
  
  try {
    // Update wallet balance in store
    useWalletStore.getState().setBalance(balance - amount);
    
    // Log transaction to ledger - fixed to match the actual schema
    await supabase.from('ledger_entries').insert({
      amount: amount,
      tx_type: 'BET_HOLD',
      credit_account: 0, // Assuming a system account 
      debit_account: 0, // Assuming a player account
      meta: {
        table_id: gameState.tableId,
        action: 'REBUY',
        player_id: playerId, // Store player_id in meta instead
        status: 'confirmed'
      }
    });
    
    // Update player stack in database
    await supabase
      .from('players_at_table')
      .update({ stack: updatedSeat.stack })
      .eq('player_id', playerId)
      .eq('table_id', gameState.tableId);
    
    // Broadcast to other players
    await supabase.channel(`game:${gameState.tableId}`).send({
      type: 'broadcast',
      event: 'game_update',
      payload: updatedGameState,
    });
    
    return updatedGameState;
  } catch (error) {
    console.error('Rebuy action failed:', error);
    throw error;
  }
};
