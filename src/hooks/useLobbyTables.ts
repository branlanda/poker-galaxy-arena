import { useState, useEffect } from 'react';
import { TableData } from '@/types/lobby';
import { supabase } from '@/lib/supabase';

export function useLobbyTables() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('lobby_tables')
          .select('*')
          .order('last_activity', { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setTables(data || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load tables');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();

    // Set up a real-time subscription to the 'lobby_tables' table
    const tableSubscription = supabase
      .channel('public:lobby_tables')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lobby_tables' },
        (payload) => {
          // When any change occurs in the table, refetch the data
          fetchTables();
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(tableSubscription);
    };
  }, []);

  return { tables, loading, error };
}

