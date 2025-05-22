
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';

export function useJoinTable() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const joinTable = async (tableId: string, buyIn: number, password?: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to join a table',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setLoading(true);
      
      // Verify table exists and check password if needed
      const { data: tableData, error: tableError } = await supabase
        .from('lobby_tables')
        .select('*')
        .eq('id', tableId)
        .single();
        
      if (tableError) throw new Error(tableError.message);
      
      // Check if table is full
      if (tableData.current_players >= tableData.max_players) {
        throw new Error('This table is full');
      }
      
      // Check password for private tables
      if (tableData.is_private && tableData.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Check buy-in range
      if (buyIn < tableData.min_buy_in || buyIn > tableData.max_buy_in) {
        throw new Error(`Buy-in must be between ${tableData.min_buy_in} and ${tableData.max_buy_in}`);
      }

      // Add player to table
      const { error: joinError } = await supabase
        .from('players_at_table')
        .insert({
          player_id: user.id,
          table_id: tableId,
          stack: buyIn,
        });

      if (joinError) throw new Error(joinError.message);
      
      toast({
        title: 'Success',
        description: `You've joined the table successfully`,
      });
      
      // Navigate to game room
      navigate(`/game/${tableId}`);
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to join table: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    joinTable,
    loading,
  };
}
