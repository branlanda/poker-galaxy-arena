
import { useState, useEffect, useCallback } from 'react';
import { usePokerGameStore } from '@/stores/pokerGame';
import { useAuth } from '@/stores/auth';
import { PlayerAction } from '@/types/poker';

export function usePokerGame(tableId: string) {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  
  const {
    game,
    players,
    actions,
    isLoading,
    error,
    playerHandVisible,
    initializeGame,
    unsubscribeFromGame,
    performAction,
    sitDown,
    leaveTable,
    togglePlayerHandVisibility
  } = usePokerGameStore();
  
  // Initialize the game when component mounts
  useEffect(() => {
    if (tableId) {
      initializeGame(tableId);
    }
    
    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeFromGame();
    };
  }, [tableId, initializeGame, unsubscribeFromGame]);
  
  // Helper to check if the current user is seated
  const isPlayerSeated = user?.id && players.some(p => p.playerId === user.id);
  
  // Helper to get the current user's seat number
  const playerSeatIndex = user?.id && players.find(p => p.playerId === user.id)?.seatNumber;
  
  // Helper to check if it's the current player's turn
  const isPlayerTurn = user?.id && 
    game?.activeSeat !== undefined && 
    players.some(p => 
      p.playerId === user.id && 
      p.seatNumber === game.activeSeat
    );
  
  // Helper to get the player's state
  const playerState = user?.id && players.find(p => p.playerId === user.id);
  
  // Handle player sitting down
  const handleSitDown = useCallback(async (seatNumber: number, buyIn: number) => {
    if (!user?.id || !game?.id) return;
    
    setIsJoining(true);
    try {
      await sitDown(game.id, user.id, seatNumber, buyIn);
    } finally {
      setIsJoining(false);
    }
  }, [user?.id, game?.id, sitDown]);
  
  // Handle player actions
  const handleAction = useCallback(async (action: PlayerAction, amount?: number) => {
    if (!user?.id) return;
    await performAction(user.id, action, amount);
  }, [user?.id, performAction]);
  
  // Handle player leaving the table
  const handleLeaveTable = useCallback(async () => {
    if (!user?.id) return;
    await leaveTable(user.id);
  }, [user?.id, leaveTable]);

  return {
    game,
    players,
    actions,
    isLoading,
    error,
    isJoining,
    playerHandVisible,
    isPlayerSeated,
    isPlayerTurn,
    playerSeatIndex,
    playerState,
    userId: user?.id,
    handleSitDown,
    handleAction,
    handleLeaveTable,
    togglePlayerHandVisibility
  };
}
