
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LobbyTable, TableFilters, TableType, TableStatus } from '@/types/lobby';
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

  // Sort tables function - by activity and status
  const sortTables = (tables: LobbyTable[]): LobbyTable[] => {
    return [...tables].sort((a, b) => {
      // First sort by active status
      if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
      if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1;
      
      // Then by active player count
      const aActive = a.active_players || 0;
      const bActive = b.active_players || 0;
      if (aActive > bActive) return -1;
      if (aActive < bActive) return 1;
      
      // Then by last activity
      const aActivity = a.last_activity ? new Date(a.last_activity).getTime() : 0;
      const bActivity = b.last_activity ? new Date(b.last_activity).getTime() : 0;
      if (aActivity > bActivity) return -1;
      if (aActivity < bActivity) return 1;
      
      // Finally by creation date (newest first)
      const aCreated = new Date(a.created_at).getTime();
      const bCreated = new Date(b.created_at).getTime();
      return bCreated - aCreated;
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
          .order('last_activity', { ascending: false, nullsLast: true });
        
        if (error) throw new Error(error.message);
        
        // Cast the data to the correct type
        const typedData = data.map(item => ({
          ...item,
          table_type: item.table_type as TableType,
          status: item.status as TableStatus
        }));
        
        setTables(typedData);
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
            const newTable = {
              ...payload.new,
              table_type: payload.new.table_type as TableType,
              status: payload.new.status as TableStatus
            } as LobbyTable;
            setTables(current => sortTables([newTable, ...current]));
          } 
          else if (payload.eventType === 'UPDATE') {
            const updatedTable = {
              ...payload.new,
              table_type: payload.new.table_type as TableType,
              status: payload.new.status as TableStatus
            } as LobbyTable;
            setTables(current => 
              sortTables(current.map(table => 
                table.id === payload.new.id ? updatedTable : table
              ))
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

  // Filtered and sorted tables
  const filteredTables = sortTables(applyFilters(tables));

  return {
    tables: filteredTables,
    loading,
    error
  };
}
