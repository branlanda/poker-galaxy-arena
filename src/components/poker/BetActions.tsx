
import React, { useState } from 'react';
import { useGameStore } from '@/stores/game';
import { PlayerAction } from '@/types/lobby';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';

interface BetActionsProps {
  playerId: string;
  playerStack: number;
  currentBet: number;
  playerBet: number;
}

export const BetActions: React.FC<BetActionsProps> = ({
  playerId,
  playerStack,
  currentBet,
  playerBet
}) => {
  const { placeBet } = useGameStore();
  const [betAmount, setBetAmount] = useState(currentBet * 2);
  
  const callAmount = currentBet - playerBet;
  const canCheck = callAmount === 0;
  const canCall = callAmount > 0 && callAmount <= playerStack;
  const canRaise = playerStack > callAmount;
  
  const handleAction = async (action: PlayerAction, amount?: number) => {
    if (action === 'FOLD') {
      await placeBet(playerId, 0, 'FOLD');
    } else if (action === 'CHECK') {
      await placeBet(playerId, 0, 'CHECK');
    } else if (action === 'CALL') {
      await placeBet(playerId, callAmount, 'CALL');
    } else if (action === 'RAISE' || action === 'BET') {
      await placeBet(playerId, amount || betAmount, action);
    } else if (action === 'ALL_IN') {
      await placeBet(playerId, playerStack, 'ALL_IN');
    }
  };
  
  return (
    <div className="flex flex-col gap-3 w-full max-w-md bg-navy/30 p-4 rounded-lg border border-emerald/10">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleAction('FOLD')}
        >
          Fold
        </Button>
        
        {canCheck && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('CHECK')}
          >
            Check
          </Button>
        )}
        
        {canCall && (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleAction('CALL')}
          >
            Call {callAmount}
          </Button>
        )}
        
        {canRaise && currentBet > 0 && (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleAction('RAISE')}
          >
            Raise
          </Button>
        )}
        
        {canRaise && currentBet === 0 && (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleAction('BET')}
          >
            Bet
          </Button>
        )}
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleAction('ALL_IN')}
        >
          All-In
        </Button>
      </div>
      
      {canRaise && (
        <div className="flex items-center gap-2">
          <Input
            type="range"
            min={currentBet * 2}
            max={playerStack}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full"
          />
          <span className="w-16 text-center">{betAmount}</span>
        </div>
      )}
    </div>
  );
};
