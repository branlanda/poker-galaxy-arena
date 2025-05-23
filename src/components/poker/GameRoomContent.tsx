
import React from 'react';
import { GameState } from '@/types/game';
import { LobbyTable, PlayerAtTable } from '@/types/lobby';
import { TableHeader } from '@/components/poker/TableHeader';
import { PokerTable } from '@/components/poker/PokerTable';
import { GameTabs } from '@/components/poker/GameTabs';

interface GameRoomContentProps {
  table: LobbyTable;
  gameState: GameState | null;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  playerSeatIndex: number;
  userId: string | undefined;
  players: PlayerAtTable[];
  onSitDown: (seatNumber: number) => void;
  onLeaveTable: () => void;
}

export const GameRoomContent: React.FC<GameRoomContentProps> = ({
  table,
  gameState,
  isPlayerSeated,
  isPlayerTurn,
  playerSeatIndex,
  userId,
  players,
  onSitDown,
  onLeaveTable,
}) => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Table header with info and controls */}
      <TableHeader table={table} onLeaveTable={onLeaveTable} />
      
      {/* Main poker table layout */}
      <div className="bg-navy/50 border border-emerald/10 rounded-lg p-6 mb-6">
        {/* The table itself */}
        <PokerTable 
          gameState={gameState}
          isPlayerSeated={isPlayerSeated}
          isPlayerTurn={isPlayerTurn}
          playerSeatIndex={playerSeatIndex}
          userId={userId}
          onSitDown={onSitDown}
        />
        
        {/* Game messages, chat, and player list */}
        <div className="mt-6">
          <GameTabs 
            tableId={table.id}
            players={players}
            gameState={gameState}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
}
