
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayerAction } from '@/types/lobby';

interface BetActionsButtonsProps {
  canCheck: boolean;
  canCall: boolean;
  canRaise: boolean;
  callAmount: number;
  currentBet: number;
  onAction: (action: PlayerAction) => void;
}

export function BetActionsButtons({
  canCheck,
  canCall,
  canRaise,
  callAmount,
  currentBet,
  onAction
}: BetActionsButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAction('FOLD')}
        aria-label="Fold your hand"
      >
        Fold
      </Button>
      
      {canCheck && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction('CHECK')}
          aria-label="Check (make no bet)"
        >
          Check
        </Button>
      )}
      
      {canCall && (
        <Button
          variant="default"
          size="sm"
          onClick={() => onAction('CALL')}
          aria-label={`Call ${callAmount}`}
        >
          Call {callAmount}
        </Button>
      )}
      
      {canRaise && currentBet > 0 && (
        <Button
          variant="default"
          size="sm"
          onClick={() => onAction('RAISE')}
          aria-label="Raise the bet"
        >
          Raise
        </Button>
      )}
      
      {canRaise && currentBet === 0 && (
        <Button
          variant="default"
          size="sm"
          onClick={() => onAction('BET')}
          aria-label="Make a bet"
        >
          Bet
        </Button>
      )}
      
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onAction('ALL_IN')}
        aria-label={`Go all in with your chips`}
      >
        All-In
      </Button>
    </div>
  );
}
