
import { GameState, PlayerState, GameAction } from '@/types/poker';

// Helper to map DB response to our frontend model
export const mapGameStateFromDb = (data: any): GameState => {
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

export const mapPlayerStateFromDb = (data: any): PlayerState => {
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

export const mapGameActionFromDb = (data: any): GameAction => {
  return {
    id: data.id,
    gameId: data.game_id,
    playerId: data.player_id,
    action: data.action,
    amount: data.amount,
    createdAt: data.created_at
  };
};
