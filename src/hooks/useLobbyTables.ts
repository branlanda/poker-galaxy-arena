
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LobbyTable, TableFilters } from '@/types/lobby';
import { useToast } from '@/hooks/use-toast';

export function useLobbyTables(filters: TableFilters) {
  const [tables, setTables] = useState<LobbyTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Apply filters function
  const applyFilters = (tables: LobbyTable[]): LobbyTable[] => {
    return tables.filter(table => {
      // Text search
      const matchesSearch = filters.searchQuery 
        ? table.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
        : true;
      
      // Table type
      const matchesType = filters.tableType === 'ALL' || table.table_type === filters.tableType;
      
      // Blinds range
      const matchesBlinds = 
        table.big_blind >= filters.blindsRange[0] && 
        table.big_blind <= filters.blindsRange[1];
      
      // Buy-in range
      const matchesBuyIn = 
        table.min_buy_in <= filters.buyInRange[1] && 
        table.max_buy_in >= filters.buyInRange[0];
      
      // Table occupancy
      const isFull = table.current_players >= table.max_players;
      const isEmpty = table.current_players === 0;
      
      // Check full tables filter
      const matchesFull = !isFull || filters.showFull;
      
      // Check empty tables filter
      const matchesEmpty = !isEmpty || filters.showEmpty;
      
      // Check private tables filter
      const matchesPrivate = !table.is_private || filters.showPrivate;
      
      return matchesSearch && matchesType && matchesBlinds && matchesBuyIn && 
             matchesFull && matchesEmpty && matchesPrivate;
    });
  };

  useEffect(() => {
    // Initial fetch of tables
    const fetchTables = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('lobby_tables')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw new Error(error.message);
        
        setTables(data);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: 'Error',
          description: `Failed to load tables: ${err.message}`,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('lobby_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'lobby_tables' 
        }, 
        (payload) => {
          // Handle different events
          if (payload.eventType === 'INSERT') {
            setTables(current => [payload.new as LobbyTable, ...current]);
          } 
          else if (payload.eventType === 'UPDATE') {
            setTables(current => 
              current.map(table => 
                table.id === payload.new.id ? payload.new as LobbyTable : table
              )
            );
          }
          else if (payload.eventType === 'DELETE') {
            setTables(current => 
              current.filter(table => table.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Filtered tables
  const filteredTables = applyFilters(tables);

  return {
    tables: filteredTables,
    loading,
    error
  };
}
