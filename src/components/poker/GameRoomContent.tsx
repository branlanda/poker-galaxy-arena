
import React from 'react';
import { PokerGame } from './PokerGame';
import { GameChat } from './GameChat';
import { TableHeader } from './TableHeader';
import { PlayerAction } from '@/types/poker';
import { toast } from '@/hooks/use-toast';
import { GameTabs } from './GameTabs';

interface GameRoomContentProps {
  tableId: string;
  tableData: any;
  players: any[];
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  isJoining: boolean;
  onSitDown: (seatNumber: number, buyIn: number) => void;
  onAction: (action: PlayerAction, amount?: number) => Promise<void>;
  onLeaveTable: () => void;
}

export const GameRoomContent: React.FC<GameRoomContentProps> = ({
  tableId,
  tableData,
  players,
  isPlayerSeated,
  isPlayerTurn,
  isJoining,
  onSitDown,
  onAction,
  onLeaveTable
}) => {
  const handleSitDown = (seatNumber: number, buyIn: number) => {
    if (isJoining) return;
    
    // Validate buy-in amount
    if (buyIn < (tableData.min_buy_in || 1000)) {
      toast({
        title: 'Error',
        description: `Minimum buy-in is ${tableData.min_buy_in || 1000}`,
        variant: 'destructive',
      });
      return;
    }
    
    if (buyIn > (tableData.max_buy_in || 10000)) {
      toast({
        title: 'Error',
        description: `Maximum buy-in is ${tableData.max_buy_in || 10000}`,
        variant: 'destructive',
      });
      return;
    }
    
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
    <div className="flex flex-col lg:flex-row h-full gap-4 p-4">
      <div className="lg:flex-1 order-2 lg:order-1">
        <PokerGame
          tableId={tableId}
          isPlayerSeated={isPlayerSeated}
          isPlayerTurn={isPlayerTurn}
          onSitDown={handleSitDown}
          onAction={handleAction}
        />
      </div>
      
      <div className="w-full lg:w-80 order-1 lg:order-2 space-y-4">
        <TableHeader
          name={tableData.name}
          blinds={`${tableData.small_blind}/${tableData.big_blind}`}
          buyIn={`${tableData.min_buy_in}-${tableData.max_buy_in}`}
          players={`${players.length}/${tableData.max_players}`}
          onLeave={onLeaveTable}
        />
        
        <GameTabs tableId={tableId} />
      </div>
    </div>
  );
};
