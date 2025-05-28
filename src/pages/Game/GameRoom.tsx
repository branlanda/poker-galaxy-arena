
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGameRoom } from '@/hooks/useGameRoom';
import { GameRoomLoader } from '@/components/poker/GameRoomLoader';
import { GameRoomError } from '@/components/poker/GameRoomError';
import { GameRoomContent } from '@/components/poker/GameRoomContent';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/stores/auth';

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
    id: gameState.id || table.id,
    tableId: gameState.tableId,
    phase: gameState.phase,
    pot: gameState.pot,
    dealerSeat: gameState.dealerSeat,
    activeSeat: gameState.activeSeat,
    activePlayerId: gameState.activePlayerId,
    communityCards: gameState.communityCards || [],
    currentBet: gameState.currentBet,
    lastActionTime: gameState.lastActionTime || new Date().toISOString(),
    lastAction: gameState.lastAction,
    seats: gameState.seats,
    createdAt: gameState.createdAt || new Date().toISOString(),
    dealer: gameState.dealer || gameState.dealerSeat,
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
