
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { TableType } from '@/types/lobby';
import { useTranslation } from '@/hooks/useTranslation';

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
  const { t } = useTranslation();

  const createTable = async (params: CreateTableParams) => {
    if (!user) {
      toast({
        title: t('error'),
        description: t('mustBeLoggedIn'),
        variant: 'destructive',
      });
      return null;
    }

    try {
      setLoading(true);
      
      // Validation checks
      if (!params.name.trim()) {
        throw new Error(t('tableNameRequired'));
      }
      
      if (params.name.length < 3 || params.name.length > 30) {
        throw new Error(t('tableNameLength'));
      }
      
      if (params.smallBlind <= 0) {
        throw new Error(t('smallBlindPositive'));
      }
      
      if (params.bigBlind <= params.smallBlind) {
        throw new Error(t('bigBlindGreaterThanSmall'));
      }
      
      // Validate buy-in ranges
      if (params.minBuyIn > params.maxBuyIn) {
        throw new Error(t('minBuyInGreaterThanMax'));
      }

      // Validate blinds vs buy-ins
      if (params.minBuyIn < params.bigBlind * 20) {
        throw new Error(t('minBuyInTooLow'));
      }
      
      // Check if private table has password
      if (params.isPrivate && (!params.password || params.password.length < 3)) {
        throw new Error(t('privateTablePasswordRequired'));
      }
      
      // Create the table in database
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
          last_activity: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      // Add the creator as a player at the table
      const { error: joinError } = await supabase
        .from('players_at_table')
        .insert({
          player_id: user.id,
          table_id: data.id,
          stack: params.minBuyIn,
        });
        
      if (joinError) throw joinError;
      
      toast({
        title: t('success'),
        description: t('tableCreatedSuccess', { name: params.name }),
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: t('error'),
        description: t('failedToCreateTable', { message: error.message }),
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
