
import React from 'react';
import { GameTableManager } from './game/GameTableManager';
import { GameState, PlayerState } from '@/types/poker';

interface GameRoomContentProps {
  tableId: string;
  tableData: any;
  players: PlayerState[];
  gameState: GameState | null;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  isJoining: boolean;
  userId?: string;
  onSitDown: (seatNumber: number) => void;
  onAction: (action: string, amount?: number) => void;
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Poker Galaxy Arena
          </h1>
          <p className="text-emerald-300 text-lg">
            Table: {tableData?.name || 'Unknown Table'}
          </p>
        </div>
        
        {/* Game information */}
        <div className="text-center text-emerald-200 mb-8">
          <p>Click the notification badge to open the poker table</p>
        </div>
      </div>

      {/* Game Table Manager handles the modal and notifications */}
      <GameTableManager
        tableId={tableId}
      />
    </div>
  );
};
