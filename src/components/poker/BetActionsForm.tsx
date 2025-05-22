
import React, { useRef, useEffect, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';

interface BetActionsFormProps {
  currentBet: number;
  playerStack: number;
  betAmount: number;
  onBetAmountChange: (amount: number) => void;
  onCancel: () => void;
  onConfirm: (amount: number) => void;
}

export function BetActionsForm({
  currentBet,
  playerStack,
  betAmount,
  onBetAmountChange,
  onCancel,
  onConfirm
}: BetActionsFormProps) {
  const raiseInputRef = useRef<HTMLInputElement>(null);
  
  // Focus on raise input when form is shown
  useEffect(() => {
    if (raiseInputRef.current) {
      raiseInputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(betAmount);
  };
  
  const minBet = currentBet > 0 ? currentBet * 2 : 1;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <label htmlFor="bet-amount" className="block text-sm font-medium">
          {currentBet > 0 ? 'Raise to:' : 'Bet amount:'}
        </label>
        <div className="flex items-center gap-2">
          <Input
            id="bet-amount"
            ref={raiseInputRef}
            type="range"
            min={minBet}
            max={playerStack}
            value={betAmount}
            onChange={(e) => onBetAmountChange(Number(e.target.value))}
            className="w-full"
            aria-label={`Set bet amount, between ${minBet} and ${playerStack}`}
          />
          <Input
            type="number"
            min={minBet}
            max={playerStack}
            value={betAmount}
            onChange={(e) => onBetAmountChange(Number(e.target.value))}
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
          onClick={onCancel}
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
  );
}
