
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
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
        title: "❌ Error",
        description: t('errors.mustBeLoggedIn', 'You must be logged in to create a table'),
        variant: 'destructive',
      });
      return null;
    }

    try {
      setLoading(true);
      
      console.log('Creating table with params:', params);
      console.log('User creating table:', user);
      
      // Basic validation
      if (!params.name.trim()) {
        throw new Error(t('errors.tableNameRequired', 'Table name is required'));
      }
      
      if (params.name.length < 3 || params.name.length > 50) {
        throw new Error(t('errors.tableNameLength', 'Table name must be between 3 and 50 characters'));
      }
      
      if (params.smallBlind <= 0) {
        throw new Error(t('errors.smallBlindPositive', 'Small blind must be positive'));
      }
      
      if (params.bigBlind <= params.smallBlind) {
        throw new Error(t('errors.bigBlindGreaterThanSmall', 'Big blind must be greater than small blind'));
      }
      
      // Create the table in database
      const tableData = {
        name: params.name.trim(),
        creator_id: user.id,
        small_blind: params.smallBlind,
        big_blind: params.bigBlind,
        min_buy_in: params.minBuyIn,
        max_buy_in: params.maxBuyIn,
        max_players: params.maxPlayers,
        table_type: params.tableType,
        is_private: params.isPrivate,
        password: params.isPrivate ? params.password : null,
        status: 'WAITING',
        current_players: 0,
      };

      console.log('Inserting table data:', tableData);

      const { data, error } = await supabase
        .from('lobby_tables')
        .insert(tableData)
        .select()
        .single();

      if (error) {
        console.error('Error creating table:', error);
        throw new Error(`Failed to create table: ${error.message}`);
      }
      
      console.log('Table created successfully:', data);
      
      toast({
        title: "🎉 Success!",
        description: `Table "${params.name}" created successfully!`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Create table error:', error);
      toast({
        title: "❌ Error",
        description: error.message || t('errors.failedToCreateTable', 'Failed to create table'),
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
