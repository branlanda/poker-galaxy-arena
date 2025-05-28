
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameRoomHeader } from './game/GameRoomHeader';
import { GameRoomSidebar } from './game/GameRoomSidebar';
import { GameRoomMainArea } from './game/GameRoomMainArea';
import { GameRoomBottomControls } from './game/GameRoomBottomControls';
import { GameState, PlayerState } from '@/types/poker';
import { PlayerAtTable, LobbyTable } from '@/types/lobby';

interface GameRoomContentProps {
  tableId: string;
  tableData: LobbyTable;
  players: PlayerAtTable[];
  gameState: GameState | null;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  isJoining: boolean;
  userId?: string;
  onSitDown: (seatNumber: number) => void;
  onAction: (action: string, amount?: number) => void;
  onLeaveTable: () => void;
}

// Helper function to transform PlayerAtTable to PlayerState
const transformPlayerAtTableToPlayerState = (player: PlayerAtTable): PlayerState => {
  return {
    id: player.id,
    gameId: '',
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

export const GameRoomContent: React.FC<GameRoomContentProps> = ({
  tableId,
  tableData,
  players,
  gameState,
  isPlayerSeated,
  isPlayerTurn,
  isJoining,
  userId,
  onSitDown,
  onAction,
  onLeaveTable
}) => {
  const navigate = useNavigate();
  
  // Transform players data to PlayerState format for GameTable
  const transformedPlayers: PlayerState[] = players.map(transformPlayerAtTableToPlayerState);
  
  const playerState = isPlayerSeated ? 
    transformedPlayers.find(p => p.playerId === userId) : undefined;

  const handleTableSelect = (newTableId: string) => {
    navigate(`/game/${newTableId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col text-white">
      <GameRoomHeader 
        tableId={tableId}
        tableData={tableData}
        players={players}
        gamePhase={gameState?.phase}
        pot={gameState?.pot}
        onTableSelect={handleTableSelect}
      />
      
      {/* Main Game Area */}
      <div className="flex-1 flex">
        <GameRoomSidebar 
          tableId={tableId}
          userId={userId}
          players={players}
          gameState={gameState}
          tableData={tableData}
        />

        <GameRoomMainArea 
          gameState={gameState}
          transformedPlayers={transformedPlayers}
          userId={userId}
          isJoining={isJoining}
          onSitDown={onSitDown}
        />
      </div>
      
      <GameRoomBottomControls 
        isPlayerSeated={isPlayerSeated}
        isPlayerTurn={isPlayerTurn}
        gameState={gameState}
        playerState={playerState}
        onAction={onAction}
        onLeaveTable={onLeaveTable}
      />
    </div>
  );
};
