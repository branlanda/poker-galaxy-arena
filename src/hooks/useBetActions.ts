
import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/game';
import { PlayerAction } from '@/types/lobby';

interface UseBetActionsProps {
  playerId: string;
  playerStack: number;
  currentBet: number;
  playerBet: number;
}

export function useBetActions({
  playerId,
  playerStack,
  currentBet,
  playerBet
}: UseBetActionsProps) {
  const { placeBet } = useGameStore();
  const [betAmount, setBetAmount] = useState(currentBet * 2);
  const [isRaising, setIsRaising] = useState(false);
  
  const callAmount = currentBet - playerBet;
  const canCheck = callAmount === 0;
  const canCall = callAmount > 0 && callAmount <= playerStack;
  const canRaise = playerStack > callAmount;
  
  // Update bet amount when currentBet changes
  useEffect(() => {
    setBetAmount(Math.min(currentBet * 2, playerStack));
  }, [currentBet, playerStack]);
  
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
  
  const confirmRaise = (amount: number) => {
    handleAction(currentBet > 0 ? 'RAISE' : 'BET', amount);
  };
  
  const cancelRaise = () => {
    setIsRaising(false);
  };
  
  return {
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
  };
}
