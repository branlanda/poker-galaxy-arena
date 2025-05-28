
import { useGameData } from '@/hooks/game/useGameData';
import { usePlayerActions } from '@/hooks/game/usePlayerActions';
import { useGameSubscriptions } from '@/hooks/game/useGameSubscriptions';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { PlayerState } from '@/types/poker';

// Timeout configuration (30 seconds for each turn)
const TURN_TIMEOUT_MS = 30000;

export function useGameRoom(tableId: string | undefined) {
  const [turnTimeRemaining, setTurnTimeRemaining] = useState(TURN_TIMEOUT_MS);
  const [turnStartTime, setTurnStartTime] = useState<number | null>(null);

  // Get game data and state
  const {
    table,
    players,
    gameState, 
    loading,
    gameLoading,
    gameError,
    isPlayerSeated,
    isPlayerTurn,
    playerSeatIndex,
    userId
  } = useGameData(tableId);

  // Get player state - properly transform from game state seats
  const playerState = isPlayerSeated && gameState?.seats && playerSeatIndex !== -1 ? 
    (() => {
      const seat = gameState.seats[playerSeatIndex];
      if (!seat) return undefined;
      
      // Transform SeatState to PlayerState
      const transformedPlayer: PlayerState = {
        id: `seat-${playerSeatIndex}`,
        gameId: gameState.id || tableId || '',
        playerId: seat.playerId,
        playerName: seat.playerName,
        seatNumber: playerSeatIndex,
        stack: seat.stack,
        holeCards: seat.cards,
        status: seat.status === 'SITTING' ? 'SITTING' : 
               seat.status === 'PLAYING' ? 'PLAYING' :
               seat.status === 'FOLDED' ? 'FOLDED' :
               seat.status === 'ALL_IN' ? 'ALL_IN' : 'SITTING',
        currentBet: seat.currentBet || seat.bet || 0,
        isDealer: seat.isDealer || false,
        isSmallBlind: seat.isSmallBlind || false,
        isBigBlind: seat.isBigBlind || false,
        createdAt: new Date().toISOString()
      };
      return transformedPlayer;
    })() : undefined;

  // Set up real-time subscriptions
  useGameSubscriptions({
    tableId, 
    userId,
    isPlayerTurn,
    turnStartTime,
    setTurnStartTime,
    setTurnTimeRemaining,
    TURN_TIMEOUT_MS
  });

  // Get player action handlers with enhanced parameters
  const { handleSitDown, handleAction, leaveTable } = usePlayerActions({
    tableId,
    userId,
    table,
    isPlayerTurn,
    setTurnTimeRemaining,
    TURN_TIMEOUT_MS,
    playerState,
    gameState: gameState ? {
      id: gameState.id || tableId || '',
      tableId: gameState.tableId || tableId || '',
      phase: gameState.phase,
      pot: gameState.pot,
      dealerSeat: gameState.dealer,
      activeSeat: gameState.seats?.findIndex((seat: any) => seat?.playerId === gameState.activePlayerId),
      activePlayerId: gameState.activePlayerId,
      communityCards: (gameState.communityCards || []).map((card: any) => ({
        suit: card.suit,
        value: card.value,
        code: card.code || `${card.value}${card.suit.charAt(0).toUpperCase()}`
      })),
      currentBet: gameState.currentBet,
      lastActionTime: new Date().toISOString(),
      lastAction: gameState.lastAction ? {
        id: `action-${Date.now()}`,
        gameId: gameState.id || tableId || '',
        playerId: gameState.lastAction.playerId,
        action: gameState.lastAction.action,
        amount: gameState.lastAction.amount,
        createdAt: new Date().toISOString()
      } : undefined,
      seats: gameState.seats,
      createdAt: new Date().toISOString(),
      dealer: gameState.dealer,
      smallBlind: table?.small_blind,
      bigBlind: table?.big_blind
    } : null
  });

  // Enhanced error handling for RLS issues
  const enhancedGameError = gameError || 
    (table && !gameState && !gameLoading ? 'No se pudo cargar el estado del juego. Verifica que tengas permisos para acceder a esta mesa.' : null);

  return {
    table,
    players,
    gameState,
    loading,
    gameLoading,
    gameError: enhancedGameError,
    isPlayerSeated,
    isPlayerTurn,
    playerSeatIndex,
    turnTimeRemaining,
    userId,
    playerState,
    handleSitDown,
    handleAction,
    leaveTable
  };
}
