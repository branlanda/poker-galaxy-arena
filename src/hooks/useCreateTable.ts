
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { TableType } from '@/types/lobby';

interface CreateTableParams {
  name: string;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  maxPlayers: number;
  tableType: TableType;
  isPrivate: boolean;
  password?: string;
}

export function useCreateTable() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createTable = async (params: CreateTableParams) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a table',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setLoading(true);
      
      // Validate buy-in ranges
      if (params.minBuyIn > params.maxBuyIn) {
        throw new Error('Minimum buy-in cannot be greater than maximum buy-in');
      }

      // Validate blinds vs buy-ins
      if (params.minBuyIn < params.bigBlind * 20) {
        throw new Error('Minimum buy-in should be at least 20 big blinds');
      }
      
      const { data, error } = await supabase
        .from('lobby_tables')
        .insert({
          name: params.name,
          creator_id: user.id,
          small_blind: params.smallBlind,
          big_blind: params.bigBlind,
          min_buy_in: params.minBuyIn,
          max_buy_in: params.maxBuyIn,
          max_players: params.maxPlayers,
          table_type: params.tableType,
          is_private: params.isPrivate,
          password: params.isPrivate ? params.password : null,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Table "${params.name}" created successfully`,
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to create table: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTable,
    loading,
  };
}
