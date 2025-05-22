
import { useParams } from 'react-router-dom';
import { useGameRoom } from '@/hooks/useGameRoom';
import { GameRoomContent } from '@/components/poker/GameRoomContent';
import { GameRoomLoader } from '@/components/poker/GameRoomLoader';
import { GameRoomError } from '@/components/poker/GameRoomError';

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

  if (loading || gameLoading) {
    return <GameRoomLoader />;
  }

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
