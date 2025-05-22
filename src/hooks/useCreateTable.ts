
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
        title: t('error', 'Error'),
        description: t('mustBeLoggedIn', 'You must be logged in to create a table'),
        variant: 'destructive',
      });
      return null;
    }

    try {
      setLoading(true);
      
      // Validation checks
      if (!params.name.trim()) {
        throw new Error(t('tableNameRequired', 'Table name is required'));
      }
      
      if (params.name.length < 3 || params.name.length > 30) {
        throw new Error(t('tableNameLength', 'Table name must be between 3 and 30 characters'));
      }
      
      if (params.smallBlind <= 0) {
        throw new Error(t('smallBlindPositive', 'Small blind must be greater than 0'));
      }
      
      if (params.bigBlind <= params.smallBlind) {
        throw new Error(t('bigBlindGreaterThanSmall', 'Big blind must be greater than small blind'));
      }
      
      // Validate buy-in ranges
      if (params.minBuyIn > params.maxBuyIn) {
        throw new Error(t('minBuyInGreaterThanMax', 'Minimum buy-in cannot be greater than maximum buy-in'));
      }

      // Validate blinds vs buy-ins
      if (params.minBuyIn < params.bigBlind * 20) {
        throw new Error(t('minBuyInTooLow', 'Minimum buy-in should be at least 20 big blinds'));
      }
      
      // Check if private table has password
      if (params.isPrivate && (!params.password || params.password.length < 3)) {
        throw new Error(t('privateTablePasswordRequired', 'Private tables require a password (minimum 3 characters)'));
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
        title: t('success', 'Success'),
        description: t('tableCreatedSuccess', 'Table "{name}" created successfully', { name: params.name }),
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: t('error', 'Error'),
        description: t('failedToCreateTable', 'Failed to create table: {message}', { message: error.message }),
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
