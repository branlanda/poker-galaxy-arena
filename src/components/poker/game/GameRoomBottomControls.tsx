
import React from 'react';
import { GameControls } from './GameControls';
import { PlayerState, GameState } from '@/types/poker';

interface GameRoomBottomControlsProps {
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  gameState: GameState | null;
  playerState?: PlayerState;
  onAction: (action: string, amount?: number) => void;
  onLeaveTable: () => void;
}

export const GameRoomBottomControls: React.FC<GameRoomBottomControlsProps> = ({
  isPlayerSeated,
  isPlayerTurn,
  gameState,
  playerState,
  onAction,
  onLeaveTable
}) => {
  if (!isPlayerSeated || !gameState) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-sm border-t border-emerald/20 p-4">
      <div className="max-w-7xl mx-auto">
        <GameControls
          isPlayerSeated={isPlayerSeated}
          isPlayerTurn={isPlayerTurn}
          playerState={playerState}
          currentBet={gameState.currentBet}
          gamePhase={gameState.phase}
          onAction={async (action, amount) => {
            onAction(action, amount);
          }}
          onLeaveTable={onLeaveTable}
        />
      </div>
    </div>
  );
};
