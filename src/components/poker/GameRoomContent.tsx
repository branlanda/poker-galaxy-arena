
import React from 'react';
import { GameState } from '@/types/game';
import { LobbyTable, PlayerAtTable } from '@/types/lobby';
import { PlayerAction } from '@/types/poker';
import { TableHeader } from '@/components/poker/TableHeader';
import { PokerGame } from '@/components/poker/PokerGame';
import { GameTabs } from '@/components/poker/GameTabs';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/progress';

interface GameRoomContentProps {
  table: LobbyTable;
  gameState: GameState | null;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  playerSeatIndex: number;
  userId: string | undefined;
  players: PlayerAtTable[];
  turnTimeRemaining: number;
  onSitDown: (seatNumber: number, buyIn?: number) => void;
  onAction: (action: PlayerAction, amount?: number) => void;
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
  turnTimeRemaining,
  onSitDown,
  onAction,
  onLeaveTable,
}) => {
  // Calculate turn timer percentage
  const turnTimePercentage = Math.max(0, Math.min(100, (turnTimeRemaining / 30000) * 100));

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col">
      {/* Table header with info and controls */}
      <TableHeader table={table} onLeaveTable={onLeaveTable} />
      
      {/* Timer bar - only visible during active player's turn */}
      {isPlayerTurn && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Your turn</span>
            <span>{Math.ceil(turnTimeRemaining / 1000)}s</span>
          </div>
          <Progress 
            value={turnTimePercentage} 
            className={`h-2 ${turnTimePercentage < 30 ? 'bg-red-800' : 'bg-emerald-800'}`} 
          />
        </div>
      )}
      
      {/* Main poker table layout */}
      <div className="bg-navy/50 border border-emerald/10 rounded-lg p-6 mb-6 flex-1">
        {/* The table itself */}
        <div className="h-full flex flex-col">
          <PokerGame 
            tableId={table.id}
            isPlayerTurn={isPlayerTurn}
            isPlayerSeated={isPlayerSeated}
            onAction={onAction}
            onSitDown={onSitDown}
          />
        </div>
      </div>
      
      {/* Game messages, chat, and player list */}
      <div className="mt-6">
        <GameTabs 
          tableId={table.id}
          players={players}
          gameState={gameState}
          userId={userId}
        />
      </div>
      
      {/* Quick action buttons for mobile */}
      {isPlayerSeated && (
        <div className="md:hidden fixed bottom-4 left-0 right-0 px-4">
          <Button 
            onClick={onLeaveTable}
            variant="outline"
            className="w-full"
          >
            Leave Table
          </Button>
        </div>
      )}
    </div>
  );
}
