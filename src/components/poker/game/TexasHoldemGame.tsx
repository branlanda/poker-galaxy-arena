
import React from 'react';
import { TexasHoldemTable } from './TexasHoldemTable';
import { TexasHoldemControls } from './TexasHoldemControls';
import { GameState, PlayerState } from '@/types/poker';

interface TexasHoldemGameProps {
  gameState: GameState;
  players: PlayerState[];
  userId?: string;
  onSitDown: (seatNumber: number) => void;
  onAction: (action: string, amount?: number) => void;
}

export const TexasHoldemGame: React.FC<TexasHoldemGameProps> = ({
  gameState,
  players,
  userId,
  onSitDown,
  onAction
}) => {
  const playerState = userId ? players.find(p => p.playerId === userId) : undefined;
  const isPlayerTurn = playerState && gameState.activePlayerId === playerState.playerId;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/textures/felt.webp')] bg-repeat opacity-20"></div>
      
      {/* Main game area */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <TexasHoldemTable
          gameState={gameState}
          players={players}
          userId={userId}
          onSitDown={onSitDown}
          onAction={onAction}
        />
      </div>

      {/* Controls overlay */}
      <TexasHoldemControls
        gameState={gameState}
        playerState={playerState}
        isPlayerTurn={!!isPlayerTurn}
        onAction={onAction}
      />
    </div>
  );
};
