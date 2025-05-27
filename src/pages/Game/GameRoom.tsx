
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGameRoom } from '@/hooks/useGameRoom';
import { GameRoomContent } from '@/components/poker/GameRoomContent';
import { GameRoomLoader } from '@/components/poker/GameRoomLoader';
import { GameRoomError } from '@/components/poker/GameRoomError';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/stores/auth';
import { PlayerAction, GameState as PokerGameState } from '@/types/poker';

// Helper function to transform game state to poker game state
const transformGameStateToPokerGameState = (gameState: any): PokerGameState => {
  return {
    id: gameState.tableId || 'temp-id',
    tableId: gameState.tableId,
    phase: gameState.phase,
    pot: gameState.pot,
    currentBet: gameState.currentBet,
    communityCards: (gameState.communityCards || []).map((card: any) => ({
      suit: card.suit,
      value: card.value,
      code: card.code || `${card.value}${card.suit.charAt(0).toUpperCase()}`
    })),
    lastActionTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    dealerSeat: gameState.dealer,
    activeSeat: gameState.seats?.findIndex((seat: any) => seat?.playerId === gameState.activePlayerId),
    activePlayerId: gameState.activePlayerId
  };
};

export default function GameRoom() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
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
    turnTimeRemaining,
    userId,
    handleSitDown,
    handleAction,
    leaveTable
  } = useGameRoom(tableId);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to access the game room",
        variant: "destructive",
      });
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show notifications for important game events
  useEffect(() => {
    if (gameState?.lastAction && gameState.lastAction.playerId !== userId) {
      const actionMap: Record<string, string> = {
        'FOLD': 'folded',
        'CHECK': 'checked',
        'CALL': 'called',
        'BET': 'bet',
        'RAISE': 'raised',
        'ALL_IN': 'went ALL IN'
      };
      
      const action = gameState.lastAction.action;
      const actionText = actionMap[action] || action;
      
      // Find player name
      const playerSeat = gameState.seats && gameState.seats.find(seat => 
        seat && seat.playerId === gameState.lastAction?.playerId
      );
      
      if (playerSeat) {
        toast({
          title: `${playerSeat.playerName} ${actionText}`,
          variant: "default",
          duration: 2000,
        });
      }
    }
  }, [gameState?.lastAction, userId]);

  // Notify when it's player's turn
  useEffect(() => {
    if (isPlayerTurn) {
      toast({
        title: "Your Turn",
        description: "It's your turn to act",
        variant: "default",
        duration: 3000,
      });
    }
  }, [isPlayerTurn]);

  // Auto-fold when time expires
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isPlayerTurn && turnTimeRemaining <= 0) {
      toast({
        title: "Time Expired",
        description: "You took too long, auto-folding",
        variant: "destructive",
      });
      
      // Add a small delay before auto-folding
      timeoutId = setTimeout(() => {
        handleAction('FOLD');
      }, 1000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlayerTurn, turnTimeRemaining, handleAction]);

  // Redirect if table closed
  useEffect(() => {
    if (!loading && table?.status === 'CLOSED') {
      toast({
        title: "Table Closed",
        description: "This table has been closed",
        variant: "destructive",
      });
      navigate('/lobby');
    }
  }, [table, loading, navigate]);

  // Create async wrapper for handleAction
  const handleActionAsync = async (action: string, amount?: number) => {
    await handleAction(action as PlayerAction, amount);
  };

  // Show loading state
  if (loading || gameLoading) {
    return <GameRoomLoader />;
  }

  // Show error state if there's an issue
  if (gameError || !table) {
    const errorMessage = gameError || 'Table not found or you do not have permission to access it';
    return <GameRoomError error={errorMessage} onBack={() => navigate('/lobby')} />;
  }

  // Transform gameState if it exists
  const transformedGameState = gameState ? transformGameStateToPokerGameState(gameState) : null;

  return (
    <GameRoomContent 
      tableId={tableId || ''}
      tableData={table}
      players={players}
      gameState={transformedGameState}
      isPlayerSeated={isPlayerSeated}
      isPlayerTurn={isPlayerTurn}
      isJoining={false}
      userId={userId}
      onSitDown={handleSitDown}
      onAction={handleActionAsync}
      onLeaveTable={leaveTable}
    />
  );
}
