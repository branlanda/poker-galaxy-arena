
import React from 'react';
import { PokerGame } from '../PokerGame';
import { PlayerAction } from '@/types/poker';
import { toast } from '@/hooks/use-toast';

interface GameContentProps {
  tableId: string;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  isJoining: boolean;
  onSitDown: (seatNumber: number, buyIn: number) => void;
  onAction: (action: PlayerAction, amount?: number) => Promise<void>;
}

export const GameContent: React.FC<GameContentProps> = ({
  tableId,
  isPlayerSeated,
  isPlayerTurn,
  isJoining,
  onSitDown,
  onAction,
}) => {
  const handleSitDown = (seatNumber: number, buyIn: number) => {
    if (isJoining) return;
    
    onSitDown(seatNumber, buyIn);
  };

  const handleAction = async (action: PlayerAction, amount?: number) => {
    try {
      await onAction(action, amount);
    } catch (error: any) {
      toast({
        title: 'Action Failed',
        description: error.message || 'Unable to perform action',
        variant: 'destructive',
      });
    }
  };

  return (
    <PokerGame
      tableId={tableId}
      isPlayerSeated={isPlayerSeated}
      isPlayerTurn={isPlayerTurn}
      onSitDown={handleSitDown}
      onAction={handleAction}
    />
  );
};
