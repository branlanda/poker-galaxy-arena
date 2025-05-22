
import React, { useState, useRef, useEffect } from 'react';
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
  const [isRaising, setIsRaising] = useState(false);
  
  // Ref for the raise/bet input for focus management
  const raiseInputRef = useRef<HTMLInputElement>(null);
  
  const callAmount = currentBet - playerBet;
  const canCheck = callAmount === 0;
  const canCall = callAmount > 0 && callAmount <= playerStack;
  const canRaise = playerStack > callAmount;
  
  // Update bet amount when currentBet changes
  useEffect(() => {
    setBetAmount(Math.min(currentBet * 2, playerStack));
  }, [currentBet, playerStack]);
  
  // Focus on raise input when raise mode is activated
  useEffect(() => {
    if (isRaising && raiseInputRef.current) {
      raiseInputRef.current.focus();
    }
  }, [isRaising]);
  
  const handleAction = async (action: PlayerAction, amount?: number) => {
    if (action === 'FOLD') {
      await placeBet(playerId, 0, 'FOLD');
    } else if (action === 'CHECK') {
      await placeBet(playerId, 0, 'CHECK');
    } else if (action === 'CALL') {
      await placeBet(playerId, callAmount, 'CALL');
    } else if (action === 'RAISE' || action === 'BET') {
      if (isRaising) {
        await placeBet(playerId, amount || betAmount, action);
        setIsRaising(false);
      } else {
        setIsRaising(true);
        return; // Don't proceed with the action yet
      }
    } else if (action === 'ALL_IN') {
      await placeBet(playerId, playerStack, 'ALL_IN');
    }
  };
  
  const handleConfirmRaise = (e: React.FormEvent) => {
    e.preventDefault();
    handleAction(currentBet > 0 ? 'RAISE' : 'BET', betAmount);
  };
  
  const handleCancelRaise = () => {
    setIsRaising(false);
  };
  
  // Handle keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isRaising) {
      handleCancelRaise();
    }
  };
  
  return (
    <div 
      className="flex flex-col gap-3 w-full max-w-md bg-navy/30 p-4 rounded-lg border border-emerald/10"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Betting actions"
    >
      {!isRaising ? (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('FOLD')}
            aria-label="Fold your hand"
          >
            Fold
          </Button>
          
          {canCheck && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('CHECK')}
              aria-label="Check (make no bet)"
            >
              Check
            </Button>
          )}
          
          {canCall && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAction('CALL')}
              aria-label={`Call ${callAmount}`}
            >
              Call {callAmount}
            </Button>
          )}
          
          {canRaise && currentBet > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAction('RAISE')}
              aria-label="Raise the bet"
            >
              Raise
            </Button>
          )}
          
          {canRaise && currentBet === 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAction('BET')}
              aria-label="Make a bet"
            >
              Bet
            </Button>
          )}
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAction('ALL_IN')}
            aria-label={`Go all in with ${playerStack} chips`}
          >
            All-In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleConfirmRaise} className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="bet-amount" className="block text-sm font-medium">
              {currentBet > 0 ? 'Raise to:' : 'Bet amount:'}
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="bet-amount"
                ref={raiseInputRef}
                type="range"
                min={currentBet > 0 ? currentBet * 2 : 1}
                max={playerStack}
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full"
                aria-label={`Set bet amount, between ${currentBet > 0 ? currentBet * 2 : 1} and ${playerStack}`}
              />
              <Input
                type="number"
                min={currentBet > 0 ? currentBet * 2 : 1}
                max={playerStack}
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-16 text-center"
                aria-labelledby="bet-amount"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelRaise}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Confirm {currentBet > 0 ? 'Raise' : 'Bet'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
