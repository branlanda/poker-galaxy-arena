
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { TableType } from '@/types/lobby';

export interface LobbyTable {
  id: string;
  name: string;
  table_type: TableType;
  status: string;
  small_blind: number;
  big_blind: number;
  min_buy_in: number;
  max_buy_in: number;
  max_players: number;
  current_players: number;
  is_private: boolean;
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export function useLobbyTables() {
  const [tables, setTables] = useState<LobbyTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('lobby_tables')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      setTables(data || []);
      setHasMore(false);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch tables',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    console.log('Load more tables');
  };

  const refreshTables = async () => {
    await fetchTables();
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return {
    tables,
    loading,
    error,
    hasMore,
    loadMore,
    refreshTables
  };
}
