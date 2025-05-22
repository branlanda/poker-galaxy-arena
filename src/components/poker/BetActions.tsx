
import React from 'react';
import { PlayerAction } from '@/types/lobby';
import { useBetActions } from '@/hooks/useBetActions';
import { BetActionsButtons } from './BetActionsButtons';
import { BetActionsForm } from './BetActionsForm';

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
  
  // Handle keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isRaising) {
      cancelRaise();
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
        <BetActionsButtons 
          canCheck={canCheck}
          canCall={canCall}
          canRaise={canRaise}
          callAmount={callAmount}
          currentBet={currentBet}
          onAction={(action) => handleAction(action)}
        />
      ) : (
        <BetActionsForm
          currentBet={currentBet}
          playerStack={playerStack}
          betAmount={betAmount}
          onBetAmountChange={setBetAmount}
          onCancel={cancelRaise}
          onConfirm={confirmRaise}
        />
      )}
    </div>
  );
};
