
import React, { useState, useEffect } from 'react';
import { GameModal } from './GameModal';
import { GameNotificationBadge } from './GameNotificationBadge';
import { useGameRoom } from '@/hooks/useGameRoom';
import { PlayerAction } from '@/types/poker';
import { PlayerAtTable } from '@/types/lobby';
import { PlayerState } from '@/types/poker';

interface GameTableManagerProps {
  tableId?: string;
  onClose?: () => void;
}

// Helper function to transform PlayerAtTable to PlayerState
const transformPlayerAtTableToPlayerState = (player: PlayerAtTable): PlayerState => {
  return {
    id: player.id,
    gameId: '', // This will be set by the game state
    playerId: player.player_id,
    playerName: player.player_name || `Player ${player.player_id.substring(0, 4)}`,
    seatNumber: player.seat_number || 0,
    stack: player.stack,
    holeCards: undefined,
    status: player.status as any,
    currentBet: 0,
    isDealer: false,
    isSmallBlind: false,
    isBigBlind: false,
    createdAt: player.joined_at
  };
};

export const GameTableManager: React.FC<GameTableManagerProps> = ({
  tableId,
  onClose
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerHandVisible, setPlayerHandVisible] = useState(false);
  
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

  // Auto-open modal when tableId is provided
  useEffect(() => {
    if (tableId && gameState) {
      setIsModalOpen(true);
    }
  }, [tableId, gameState]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleToggleHandVisibility = () => {
    setPlayerHandVisible(!playerHandVisible);
  };

  // Transform players data to PlayerState format
  const transformedPlayers: PlayerState[] = players.map(transformPlayerAtTableToPlayerState);

  const playerState = isPlayerSeated && playerSeatIndex !== undefined ? 
    transformedPlayers.find(p => p.seatNumber === playerSeatIndex) : undefined;

  // Don't render anything if loading or no game
  if (loading || gameLoading || !gameState) {
    return null;
  }

  // Create a compatible game state for the modal
  const compatibleGameState = {
    ...gameState,
    id: gameState.id || 'temp-id',
    lastActionTime: gameState.lastActionTime || new Date().toISOString(),
    createdAt: gameState.createdAt || new Date().toISOString()
  };

  // Calculate notification data
  const activeTables = transformedPlayers.length > 0 ? 1 : 0;
  const totalPot = gameState.pot || 0;
  const hasNotifications = isPlayerTurn || gameState.phase === 'SHOWDOWN';

  // Async wrapper for handleAction
  const handleActionAsync = async (action: PlayerAction, amount?: number) => {
    await handleAction(action, amount);
  };

  return (
    <>
      {/* Game Notification Badge */}
      <GameNotificationBadge
        gameCount={isPlayerSeated ? 1 : 0}
        activeTables={activeTables}
        totalPot={totalPot}
        hasNotifications={hasNotifications}
        onClick={() => setIsModalOpen(true)}
      />

      {/* Game Modal */}
      <GameModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        game={compatibleGameState}
        players={transformedPlayers}
        userId={userId}
        playerHandVisible={playerHandVisible}
        isJoining={false}
        isPlayerSeated={isPlayerSeated}
        isPlayerTurn={isPlayerTurn}
        playerState={playerState}
        onSitDown={handleSitDown}
        onAction={handleActionAsync}
        onLeaveTable={leaveTable}
        onToggleHandVisibility={handleToggleHandVisibility}
      />
    </>
  );
};
