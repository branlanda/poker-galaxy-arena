
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGameRoom } from '@/hooks/useGameRoom';
import { GameRoomLoader } from '@/components/poker/GameRoomLoader';
import { GameRoomError } from '@/components/poker/GameRoomError';
import { GameRoomContent } from '@/components/poker/GameRoomContent';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/stores/auth';
import { Card as PokerCard } from '@/types/poker';

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
        description: "You need to sign in to access the game room",
        variant: "destructive",
      });
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Handle table closure
  useEffect(() => {
    if (!loading && table?.status === 'CLOSED') {
      toast({
        title: "Table Closed",
        description: "This table has been closed",
        variant: "destructive",
      });
      navigate('/lobby');
    }
  }, [table?.status, loading, navigate]);

  // Show loading state
  if (loading) {
    return <GameRoomLoader />;
  }

  // Show error state if there's an issue
  if (gameError || !table) {
    const errorMessage = gameError || 'Table not found or you do not have permission to access it';
    return <GameRoomError error={errorMessage} onBack={() => navigate('/lobby')} />;
  }

  // Transform gameState to include required properties for poker GameState
  const transformedGameState = gameState ? {
    id: table.id, // Use table ID as game ID
    tableId: gameState.tableId,
    phase: gameState.phase,
    pot: gameState.pot,
    dealerSeat: gameState.dealer,
    activeSeat: gameState.seats?.findIndex((seat: any) => seat?.playerId === gameState.activePlayerId),
    activePlayerId: gameState.activePlayerId,
    communityCards: (gameState.communityCards || []).map((card: any): PokerCard => ({
      suit: card.suit,
      value: card.value,
      code: card.code || `${card.value}${card.suit.charAt(0).toUpperCase()}`
    })),
    currentBet: gameState.currentBet,
    lastActionTime: new Date().toISOString(),
    lastAction: gameState.lastAction ? {
      id: `action-${Date.now()}`,
      gameId: table.id,
      playerId: gameState.lastAction.playerId,
      action: gameState.lastAction.action,
      amount: gameState.lastAction.amount,
      createdAt: new Date().toISOString()
    } : undefined,
    seats: gameState.seats,
    createdAt: new Date().toISOString(),
    dealer: gameState.dealer,
    smallBlind: table.small_blind,
    bigBlind: table.big_blind
  } : null;

  return (
    <GameRoomContent
      tableId={tableId!}
      tableData={table}
      players={players}
      gameState={transformedGameState}
      isPlayerSeated={isPlayerSeated}
      isPlayerTurn={isPlayerTurn}
      isJoining={false}
      userId={userId}
      onSitDown={handleSitDown}
      onAction={handleAction}
      onLeaveTable={leaveTable}
    />
  );
}
