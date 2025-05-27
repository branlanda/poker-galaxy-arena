
import React, { useState, useEffect } from 'react';
import { GameModal } from './GameModal';
import { GameNotificationBadge } from './GameNotificationBadge';
import { useGameRoom } from '@/hooks/useGameRoom';
import { PlayerAction } from '@/types/poker';

interface GameTableManagerProps {
  tableId?: string;
  onClose?: () => void;
}

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

  const playerState = isPlayerSeated && playerSeatIndex !== undefined ? 
    players.find(p => p.seatNumber === playerSeatIndex) : undefined;

  // Don't render anything if loading or no game
  if (loading || gameLoading || !gameState) {
    return null;
  }

  // Calculate notification data
  const activeTables = players.length > 0 ? 1 : 0;
  const totalPot = gameState.pot || 0;
  const hasNotifications = isPlayerTurn || gameState.phase === 'SHOWDOWN';

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
        game={gameState}
        players={players}
        userId={userId}
        playerHandVisible={playerHandVisible}
        isJoining={false}
        isPlayerSeated={isPlayerSeated}
        isPlayerTurn={isPlayerTurn}
        playerState={playerState}
        onSitDown={handleSitDown}
        onAction={handleAction}
        onLeaveTable={leaveTable}
        onToggleHandVisibility={handleToggleHandVisibility}
      />
    </>
  );
};
