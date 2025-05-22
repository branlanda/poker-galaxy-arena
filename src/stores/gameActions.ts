
import { supabase } from '@/integrations/supabase/client';
import { GameState, SeatState } from '@/types/game';
import { PlayerAction } from '@/types/lobby';

// Game action functions
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

export const placeBetAction = async (
  gameState: GameState,
  playerId: string,
  amount: number,
  action: PlayerAction
): Promise<GameState> => {
  if (!gameState) return gameState;
  
  // Find the player's seat
  const seatIndex = gameState.seats.findIndex(
    seat => seat !== null && seat.playerId === playerId
  );
  
  if (seatIndex === -1) return gameState;
  
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
  
  // Broadcast to other players
  await supabase.channel(`game:${gameState.tableId}`).send({
    type: 'broadcast',
    event: 'game_update',
    payload: updatedGameState,
  });
  
  return updatedGameState;
};
