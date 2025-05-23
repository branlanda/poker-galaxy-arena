
import React from 'react';
import { GameContent } from './game-content/GameContent';
import { GameSidebar } from './game-content/GameSidebar';
import { PlayerAction } from '@/types/poker';
import { LobbyTable, PlayerAtTable } from '@/types/lobby';
import { GameState } from '@/types/game';

interface GameRoomContentProps {
  tableId: string;
  tableData: LobbyTable;
  players: PlayerAtTable[];
  gameState?: GameState | null;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  isJoining: boolean;
  userId?: string;
  onSitDown: (seatNumber: number, buyIn: number) => void;
  onAction: (action: PlayerAction, amount?: number) => Promise<void>;
  onLeaveTable: () => void;
}

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
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 p-4">
      <div className="lg:flex-1 order-2 lg:order-1">
        <GameContent
          tableId={tableId}
          isPlayerSeated={isPlayerSeated}
          isPlayerTurn={isPlayerTurn}
          isJoining={isJoining}
          onSitDown={onSitDown}
          onAction={onAction}
        />
      </div>
      
      <div className="w-full lg:w-80 order-1 lg:order-2">
        <GameSidebar
          tableData={tableData}
          tableId={tableId}
          players={players}
          gameState={gameState}
          userId={userId}
          onLeaveTable={onLeaveTable}
        />
      </div>
    </div>
  );
};
