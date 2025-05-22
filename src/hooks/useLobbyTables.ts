
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LobbyTable, TableFilters, DEFAULT_FILTERS, TableType } from '@/types/lobby';
import { useToast } from '@/hooks/use-toast';

export const useLobbyTables = (filters: TableFilters = DEFAULT_FILTERS) => {
  const [tables, setTables] = useState<LobbyTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const TABLES_PER_PAGE = 20;
  const { toast } = useToast();

  // Apply filters to the table list
  const filterTablesHandler = (tables: LobbyTable[], filters: TableFilters) => {
    let results = [...tables];

    if (filters.searchQuery) {
      results = results.filter(table =>
        table.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.tableType !== 'ALL') {
      results = results.filter(table => table.table_type === filters.tableType);
    }

    results = results.filter(table =>
      table.small_blind >= filters.blindsRange[0] && table.small_blind <= filters.blindsRange[1]
    );

    results = results.filter(table =>
      table.min_buy_in >= filters.buyInRange[0] && table.max_buy_in <= filters.buyInRange[1]
    );

    if (!filters.showFull) {
      results = results.filter(table => table.current_players < table.max_players);
    }

    if (!filters.showEmpty) {
      results = results.filter(table => table.current_players > 0);
    }

    if (!filters.showPrivate) {
      results = results.filter(table => !table.is_private);
    }
    
    // Additional filters
    if (filters.showActive) {
      results = results.filter(table => table.active_players > 0);
    }
    
    return results;
  };

  // Fetch tables with pagination
  const fetchTables = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = reset ? 0 : page;
      
      // Cast result to any to bypass type errors until Supabase types are regenerated
      const { data, error } = await supabase
        .from('lobby_tables')
        .select('*')
        .order('last_activity', { ascending: false })
        .range(currentPage * TABLES_PER_PAGE, (currentPage + 1) * TABLES_PER_PAGE - 1) as { data: any, error: any };
        
      if (error) {
        console.error('Error fetching tables:', error);
        setError('Failed to load tables');
        return;
      }
      
      // Check if we've loaded all tables
      setHasMore(data.length === TABLES_PER_PAGE);
      
      // Cast data to LobbyTable[] to satisfy TypeScript
      if (reset) {
        setTables(data as unknown as LobbyTable[]);
        setPage(0);
      } else {
        setTables(prev => [...prev, ...(data as unknown as LobbyTable[])]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchTables:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  // Load more tables
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Setup realtime subscription
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('public:lobby_tables')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'lobby_tables' }, 
        payload => {
          const newTable = payload.new as unknown as LobbyTable;
          setTables(prevTables => [newTable, ...prevTables]);
          toast({
            title: "New table available!",
            description: `"${newTable.name}" has just been created`,
          });
        })
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'lobby_tables' },
        payload => {
          const updatedTable = payload.new as unknown as LobbyTable;
          setTables(prevTables => 
            prevTables.map(table => 
              table.id === updatedTable.id ? updatedTable : table
            )
          );
        })
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'lobby_tables' },
        payload => {
          const deletedTableId = payload.old.id;
          setTables(prevTables => 
            prevTables.filter(table => table.id !== deletedTableId)
          );
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Initial fetch
  useEffect(() => {
    fetchTables(true);
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    const cleanup = setupRealtimeSubscription();
    return cleanup;
  }, []);
  
  // Effect for pagination when page changes
  useEffect(() => {
    if (page > 0) {
      fetchTables();
    }
  }, [page]);

  return {
    tables: filterTablesHandler(tables, filters),
    allTables: tables,
    loading,
    error,
    hasMore,
    loadMore,
    filterTablesHandler,
    refreshTables: () => fetchTables(true)
  };
};
