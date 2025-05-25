
import React from 'react';
import { ActionControls } from '../ActionControls';
import { GameInfo } from '../GameInfo';
import { Button } from '@/components/ui/button';
import { PlayerState, PlayerAction, GameAction } from '@/types/poker';

interface GameControlsProps {
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  playerState?: PlayerState;
  currentBet: number;
  gamePhase: string;
  lastAction?: GameAction;
  onAction: (action: PlayerAction, amount?: number) => Promise<void>;
  onLeaveTable: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isPlayerSeated,
  isPlayerTurn,
  playerState,
  currentBet,
  gamePhase,
  lastAction,
  onAction,
  onLeaveTable
}) => {
  return (
    <>
      {/* Player action controls */}
      {isPlayerSeated && isPlayerTurn && playerState && (
        <div className="mt-4">
          <ActionControls
            playerState={playerState}
            currentBet={currentBet}
            onAction={onAction}
          />
        </div>
      )}
      
      {/* Game info and action buttons */}
      <div className="mt-6 flex items-start justify-between">
        <GameInfo 
          gamePhase={gamePhase}
          lastAction={lastAction}
          smallBlind={10} // This should come from table settings
          bigBlind={20}   // This should come from table settings
        />
        
        <div className="space-y-2">
          {isPlayerSeated ? (
            <Button 
              variant="outline"
              onClick={onLeaveTable}
              className="w-full"
            >
              Leave Table
            </Button>
          ) : (
            <p className="text-sm text-gray-400 text-center px-4">
              Select an empty seat to join the game
            </p>
          )}
        </div>
      </div>
    </>
  );
};
