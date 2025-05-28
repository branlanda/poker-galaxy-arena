
import React from 'react';
import { ActionControls } from '../ActionControls';
import { LeaveTableButton } from './LeaveTableButton';
import { PlayerState, PlayerAction, GameAction } from '@/types/poker';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  const isInHand = gamePhase !== 'WAITING' && playerState?.status === 'PLAYING';

  return (
    <Card className="bg-slate-800/90 border-emerald/20 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Player action controls or waiting message */}
          <div className="flex-1">
            {isPlayerSeated && isPlayerTurn && playerState ? (
              <div className="mr-4">
                <ActionControls
                  playerState={playerState}
                  currentBet={currentBet}
                  onAction={onAction}
                />
              </div>
            ) : isPlayerSeated ? (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm">
                  {isInHand ? 'Esperando tu turno...' : 'Esperando que comience la siguiente mano'}
                </p>
                {playerState && (
                  <div className="mt-2 text-emerald-400 text-sm font-medium">
                    Stack: ${playerState.stack.toLocaleString()}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm">
                  Selecciona un asiento vacío para unirte al juego
                </p>
              </div>
            )}
          </div>

          {/* Separator */}
          {isPlayerSeated && (
            <Separator orientation="vertical" className="h-12 bg-slate-600" />
          )}

          {/* Right side - Leave table button */}
          {isPlayerSeated && (
            <div className="ml-4">
              <LeaveTableButton
                onLeaveTable={onLeaveTable}
                isPlayerTurn={isPlayerTurn}
                playerStack={playerState?.stack}
                gamePhase={gamePhase}
                isInHand={isInHand}
              />
            </div>
          )}
        </div>

        {/* Additional game info */}
        {lastAction && (
          <div className="mt-3 pt-3 border-t border-slate-600">
            <div className="text-xs text-gray-400 text-center">
              Última acción: <span className="text-emerald-400">{lastAction.action}</span>
              {lastAction.amount && lastAction.amount > 0 && (
                <span className="text-white"> - ${lastAction.amount.toLocaleString()}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
