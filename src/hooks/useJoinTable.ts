
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

export function useJoinTable() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const joinTable = async (tableId: string, buyIn: number, password?: string) => {
    if (!user) {
      toast({
        title: t('error'),
        description: t('mustBeLoggedIn'),
        variant: 'destructive',
      });
      return false;
    }

    try {
      setLoading(true);
      
      // Check if the player is already at this table
      const { data: existingPlayer, error: checkError } = await supabase
        .from('players_at_table')
        .select('id, status')
        .eq('player_id', user.id)
        .eq('table_id', tableId)
        .single();
        
      if (!checkError && existingPlayer) {
        // If player is already at this table and not left
        if (existingPlayer.status !== 'LEFT') {
          // Navigate to game room since player is already joined
          navigate(`/game/${tableId}`);
          return true;
        }
        
        // If player has left previously, update their status and stack
        const { error: updateError } = await supabase
          .from('players_at_table')
          .update({
            status: 'SITTING',
            stack: buyIn
          })
          .eq('id', existingPlayer.id);
          
        if (updateError) throw updateError;
        
        toast({
          title: t('success'),
          description: t('rejoinedTable'),
        });
        
        navigate(`/game/${tableId}`);
        return true;
      }
      
      // Verify table exists and check password if needed
      const { data: tableData, error: tableError } = await supabase
        .from('lobby_tables')
        .select('*')
        .eq('id', tableId)
        .single();
        
      if (tableError) throw new Error(tableError.message);
      
      // Check if table is full
      if (tableData.current_players >= tableData.max_players) {
        throw new Error(t('tableIsFull'));
      }
      
      // Check password for private tables
      if (tableData.is_private && tableData.password !== password) {
        throw new Error(t('invalidPassword'));
      }
      
      // Check buy-in range
      if (buyIn < tableData.min_buy_in || buyIn > tableData.max_buy_in) {
        throw new Error(t('buyInRange', { 
          min: tableData.min_buy_in, 
          max: tableData.max_buy_in 
        }));
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
      
      // Update the table's last activity timestamp
      const timestamp = new Date().toISOString();
      await supabase
        .from('lobby_tables')
        .update({
          updated_at: timestamp
        })
        .eq('id', tableId);
      
      toast({
        title: t('success'),
        description: t('joinedTableSuccess'),
      });
      
      // Navigate to game room
      navigate(`/game/${tableId}`);
      return true;
    } catch (error: any) {
      toast({
        title: t('error'),
        description: t('failedToJoinTable', { message: error.message }),
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
