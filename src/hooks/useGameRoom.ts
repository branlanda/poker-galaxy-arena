
import { useGameData } from '@/hooks/game/useGameData';
import { usePlayerActions } from '@/hooks/game/usePlayerActions';
import { useGameSubscriptions } from '@/hooks/game/useGameSubscriptions';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

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

  // Get player action handlers
  const { handleSitDown, handleAction, leaveTable } = usePlayerActions({
    tableId,
    userId,
    table,
    isPlayerTurn,
    setTurnTimeRemaining,
    TURN_TIMEOUT_MS
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
    handleSitDown,
    handleAction,
    leaveTable
  };
}
