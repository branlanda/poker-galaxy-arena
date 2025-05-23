
import React from 'react';
import { TableHeader } from '../TableHeader';
import { GameTabs } from '../GameTabs';
import { LobbyTable, PlayerAtTable } from '@/types/lobby';
import { GameState } from '@/types/game';

interface GameSidebarProps {
  tableData: LobbyTable;
  tableId: string;
  players: PlayerAtTable[];
  gameState?: GameState | null;
  userId?: string;
  onLeaveTable: () => void;
}

export const GameSidebar: React.FC<GameSidebarProps> = ({
  tableData,
  tableId,
  players,
  gameState,
  userId,
  onLeaveTable
}) => {
  return (
    <div className="w-full space-y-4">
      <TableHeader
        table={tableData}
        onLeaveTable={onLeaveTable}
      />
      
      <GameTabs 
        tableId={tableId} 
        players={players} 
        gameState={gameState}
        userId={userId} 
      />
    </div>
  );
};
