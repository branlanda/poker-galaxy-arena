
import { useState } from 'react';
import { useGameStore } from '@/stores/game';
import { useBetActions } from '@/hooks/useBetActions';
import { PlayerAction } from '@/types/lobby';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface BetActionsProps {
  playerId: string;
  playerStack: number;
  currentBet: number;
  playerBet: number;
}

export function BetActions({
  playerId,
  playerStack,
  currentBet,
  playerBet
}: BetActionsProps) {
  const {
    betAmount,
    setBetAmount,
    isRaising,
    callAmount,
    canCheck,
    canCall,
    canRaise,
    handleAction,
    confirmRaise,
    cancelRaise
  } = useBetActions({
    playerId,
    playerStack,
    currentBet,
    playerBet
  });

  return (
    <div className="w-full max-w-md mx-auto bg-navy/70 p-4 rounded-lg border border-emerald/30 shadow-lg backdrop-blur-sm">
      {!isRaising ? (
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAction('FOLD')}
            className="font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400"
          >
            Fold
          </Button>
          
          {canCheck && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAction('CHECK')}
              className="font-medium"
            >
              Check
            </Button>
          )}
          
          {canCall && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleAction('CALL')}
              className="font-medium"
            >
              Call {callAmount}
            </Button>
          )}
          
          {canRaise && currentBet > 0 && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => handleAction('RAISE')}
              className="font-medium"
            >
              Raise
            </Button>
          )}
          
          {canRaise && currentBet === 0 && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => handleAction('BET')}
              className="font-medium"
            >
              Bet
            </Button>
          )}
          
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => handleAction('ALL_IN')}
            className="font-medium bg-amber-600/80 hover:bg-amber-500"
          >
            All-In ({playerStack})
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="bet-amount" className="block text-sm font-medium text-gray-200">
              {currentBet > 0 ? 'Raise to:' : 'Bet amount:'}
            </label>
            <div className="flex items-center gap-2">
              <Slider
                defaultValue={[betAmount]}
                min={currentBet > 0 ? currentBet * 2 : 1}
                max={playerStack}
                step={1}
                onValueChange={(values) => setBetAmount(values[0])}
                className="flex-1"
              />
              <Input
                type="number"
                min={currentBet > 0 ? currentBet * 2 : 1}
                max={playerStack}
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-20 text-center"
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={cancelRaise}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => confirmRaise(betAmount)}
              className="font-medium"
            >
              Confirm {currentBet > 0 ? 'Raise' : 'Bet'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
