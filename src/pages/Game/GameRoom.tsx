
import { useParams } from 'react-router-dom';
import { useGameRoom } from '@/hooks/useGameRoom';
import { GameRoomContent } from '@/components/poker/GameRoomContent';
import { GameRoomLoader } from '@/components/poker/GameRoomLoader';
import { GameRoomError } from '@/components/poker/GameRoomError';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export default function GameRoom() {
  const { id } = useParams<{ id: string }>();
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
    leaveTable
  } = useGameRoom(id);

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
      const playerSeat = gameState.seats.find(seat => 
        seat && seat.playerId === gameState.lastAction.playerId
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

  // Show loading state
  if (loading || gameLoading) {
    return <GameRoomLoader />;
  }

  // Show error state if there's an issue
  if (gameError || !table) {
    return <GameRoomError error={gameError} />;
  }

  return (
    <GameRoomContent 
      table={table}
      gameState={gameState}
      isPlayerSeated={isPlayerSeated}
      isPlayerTurn={isPlayerTurn}
      playerSeatIndex={playerSeatIndex}
      userId={userId}
      players={players}
      onSitDown={handleSitDown}
      onLeaveTable={leaveTable}
    />
  );
}
