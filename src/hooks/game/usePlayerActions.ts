
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { LobbyTable } from '@/types/lobby';
import { PlayerAction, PlayerState, GameState } from '@/types/poker';
import { useGameStore } from '@/stores/game';
import { LeaveTableLogic } from '@/utils/poker/leaveTableLogic';

interface PlayerActionsProps {
  tableId?: string;
  userId?: string;
  table: LobbyTable | null;
  isPlayerTurn: boolean;
  setTurnTimeRemaining: (time: number) => void;
  TURN_TIMEOUT_MS: number;
  playerState?: PlayerState;
  gameState?: GameState | null;
}

export function usePlayerActions({
  tableId,
  userId,
  table,
  isPlayerTurn,
  setTurnTimeRemaining,
  TURN_TIMEOUT_MS,
  playerState,
  gameState
}: PlayerActionsProps) {
  const navigate = useNavigate();
  
  const {
    takeSeat,
    leaveSeat,
    placeBet
  } = useGameStore();
  
  const handleSitDown = async (seatNumber: number, buyIn?: number) => {
    if (!userId || !tableId || !table) return;
    
    try {
      // Default buy-in at minimum if not provided
      const amount = buyIn || table.min_buy_in;
      
      // Validate buy-in amount
      if (amount < (table.min_buy_in || 1000)) {
        toast({
          title: 'Error',
          description: `Minimum buy-in is ${table.min_buy_in || 1000}`,
          variant: 'destructive',
        });
        return;
      }
      
      if (amount > (table.max_buy_in || 10000)) {
        toast({
          title: 'Error',
          description: `Maximum buy-in is ${table.max_buy_in || 10000}`,
          variant: 'destructive',
        });
        return;
      }
      
      // Create player at table entry
      const { error } = await supabase
        .from('players_at_table')
        .upsert({
          player_id: userId,
          table_id: tableId,
          seat_number: seatNumber,
          stack: amount,
          status: 'SITTING'
        }, { onConflict: 'player_id, table_id' });
        
      if (error) throw error;
      
      // Update the game state
      await takeSeat(seatNumber, userId, 'Player', amount);
      
      // Broadcast to all players that someone took a seat
      await supabase.channel(`game:${tableId}`).send({
        type: 'broadcast',
        event: 'player_seated',
        payload: {
          seatNumber,
          playerId: userId,
          playerName: 'Player',
        },
      });
      
      toast({
        title: 'Success',
        description: 'You have taken a seat at the table',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to take seat: ${error.message}`,
        variant: 'destructive',
      });
    }
  };
  
  const handleAction = async (action: PlayerAction, amount?: number) => {
    if (!userId || !isPlayerTurn) return;
    
    try {
      // Fix: Convert amount to number if it's passed as a string
      const numericAmount = amount !== undefined ? Number(amount) : undefined;
      
      await placeBet(userId, numericAmount || 0, action);
      
      // Reset turn timer
      setTurnTimeRemaining(TURN_TIMEOUT_MS);
      
      toast({
        title: 'Action performed',
        description: `You ${action.toLowerCase()}${numericAmount ? ` ${numericAmount}` : ''}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to perform action: ${error.message}`,
        variant: 'destructive',
      });
    }
  };
  
  const leaveTable = async () => {
    if (!userId || !tableId || !playerState || !gameState) return;
    
    try {
      // Use advanced poker logic for leaving
      const result = await LeaveTableLogic.processLeaveTable(
        userId,
        tableId,
        playerState,
        gameState
      );
      
      if (result.success) {
        toast({
          title: 'Table Left Successfully',
          description: result.message,
          duration: 5000,
        });
        
        // Navigate back to lobby
        navigate('/lobby');
      } else {
        toast({
          title: 'Error Leaving Table',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to leave table: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  return {
    handleSitDown,
    handleAction,
    leaveTable
  };
}
