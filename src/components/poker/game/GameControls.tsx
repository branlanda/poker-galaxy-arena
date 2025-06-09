
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { PlayerState, PlayerAction, GamePhase } from '@/types/poker';
import { Eye, EyeOff, Play } from 'lucide-react';

interface GameControlsProps {
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  playerState?: PlayerState;
  currentBet: number;
  gamePhase: GamePhase;
  onAction: (action: PlayerAction, amount?: number) => Promise<void>;
  onStartNewHand?: () => Promise<void>;
  onToggleHandVisibility?: () => void;
  onLeaveTable?: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isPlayerSeated,
  isPlayerTurn,
  playerState,
  currentBet,
  gamePhase,
  onAction,
  onStartNewHand,
  onToggleHandVisibility,
  onLeaveTable
}) => {
  const [betAmount, setBetAmount] = useState(currentBet * 2 || 10);
  const [isRaising, setIsRaising] = useState(false);

  if (!isPlayerSeated) {
    return (
      <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-slate-800/90 backdrop-blur-sm">
        <div className="text-center text-gray-300">
          <p>You are not seated at this table</p>
          <p className="text-sm text-gray-400 mt-1">Click on an empty seat to join</p>
        </div>
      </Card>
    );
  }

  const playerStack = playerState?.stack || 0;
  const playerBet = playerState?.currentBet || 0;
  const callAmount = Math.max(0, currentBet - playerBet);
  const minRaise = currentBet * 2;
  const canCheck = currentBet === playerBet;
  const canCall = currentBet > playerBet;
  const canRaise = playerStack > callAmount;

  const handleAction = async (action: PlayerAction, amount?: number) => {
    try {
      await onAction(action, amount);
      setIsRaising(false);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const handleRaise = async () => {
    await handleAction(currentBet > 0 ? 'RAISE' : 'BET', betAmount);
  };

  if (gamePhase === 'WAITING') {
    return (
      <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-slate-800/90 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="text-center text-gray-300">
            <p>Waiting for more players or next hand</p>
          </div>
          
          {onStartNewHand && (
            <Button 
              onClick={onStartNewHand}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Hand
            </Button>
          )}
          
          {onToggleHandVisibility && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleHandVisibility}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-slate-800/90 backdrop-blur-sm min-w-[400px]">
      {/* Player info */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-300">
        <span>Stack: ${playerStack}</span>
        <span>Current Bet: ${playerBet}</span>
        <span>To Call: ${callAmount}</span>
      </div>

      {!isPlayerTurn ? (
        <div className="text-center text-gray-400 py-2">
          <p>Waiting for your turn...</p>
        </div>
      ) : !isRaising ? (
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => handleAction('FOLD')}
            className="min-w-[80px]"
          >
            Fold
          </Button>
          
          {canCheck && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAction('CHECK')}
              className="min-w-[80px]"
            >
              Check
            </Button>
          )}
          
          {canCall && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleAction('CALL')}
              className="min-w-[80px]"
            >
              Call ${callAmount}
            </Button>
          )}
          
          {canRaise && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setIsRaising(true)}
              className="min-w-[80px] bg-emerald-600 hover:bg-emerald-700"
            >
              {currentBet > 0 ? 'Raise' : 'Bet'}
            </Button>
          )}
          
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => handleAction('ALL_IN')}
            className="min-w-[80px] bg-amber-600 hover:bg-amber-700"
          >
            All-In ${playerStack}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              {currentBet > 0 ? 'Raise to:' : 'Bet amount:'}
            </label>
            <div className="flex items-center gap-2">
              <Slider
                value={[betAmount]}
                min={minRaise}
                max={playerStack}
                step={5}
                onValueChange={(values) => setBetAmount(values[0])}
                className="flex-1"
              />
              <Input
                type="number"
                min={minRaise}
                max={playerStack}
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-24 text-center"
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRaising(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleRaise}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Confirm {currentBet > 0 ? 'Raise' : 'Bet'}
            </Button>
          </div>
        </div>
      )}

      {/* Additional controls */}
      <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-600">
        <div className="flex gap-2">
          {onToggleHandVisibility && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleHandVisibility}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {onLeaveTable && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onLeaveTable}
            className="text-red-400 hover:text-red-300"
          >
            Leave Table
          </Button>
        )}
      </div>
    </Card>
  );
};
