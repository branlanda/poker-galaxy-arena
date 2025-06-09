
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGameRoom } from '@/hooks/useGameRoom';
import { GameRoomLoader } from '@/components/poker/GameRoomLoader';
import { GameRoomError } from '@/components/poker/GameRoomError';
import { PremiumTexasHoldemGame } from '@/components/poker/game/PremiumTexasHoldemGame';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/stores/auth';
import { Card as PokerCard, PlayerState } from '@/types/poker';

export default function GameRoom() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transformedPlayers, setTransformedPlayers] = useState<PlayerState[]>([]);
  
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

  // Transform gameState seats to PlayerState format
  useEffect(() => {
    if (gameState?.seats) {
      const transformed: PlayerState[] = gameState.seats
        .map((seat: any, index: number) => {
          if (!seat) return null;
          
          return {
            id: `seat-${index}`,
            gameId: tableId || 'temp-game-id',
            playerId: seat.playerId,
            playerName: seat.playerName || `Player ${index + 1}`,
            seatNumber: index,
            stack: seat.stack || 0,
            holeCards: seat.cards?.map((card: any): PokerCard => ({
              suit: card.suit,
              value: card.value,
              code: card.code || `${card.value}${card.suit.charAt(0).toUpperCase()}`
            })) || [],
            status: seat.isFolded ? 'FOLDED' : 
                   seat.isAllIn ? 'ALL_IN' :
                   seat.isActive ? 'PLAYING' : 'SITTING',
            currentBet: seat.bet || 0,
            isDealer: seat.isDealer || false,
            isSmallBlind: seat.isSmallBlind || false,
            isBigBlind: seat.isBigBlind || false,
            createdAt: new Date().toISOString()
          } as PlayerState;
        })
        .filter(Boolean) as PlayerState[];
      
      setTransformedPlayers(transformed);
    }
  }, [gameState?.seats, tableId]);

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
    id: table.id,
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
    <div className="min-h-screen">
      {transformedGameState && (
        <PremiumTexasHoldemGame
          gameState={transformedGameState}
          players={transformedPlayers}
          userId={userId}
          onSitDown={handleSitDown}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
