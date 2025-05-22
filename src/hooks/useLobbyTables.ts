
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LobbyTable, TableFilters, DEFAULT_FILTERS, TableType, SortOption } from '@/types/lobby';
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
  const filterTablesHandler = useCallback((tables: LobbyTable[], filters: TableFilters) => {
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
    
    // Apply sorting
    results = sortTables(results, filters.sortBy);
    
    return results;
  }, []);

  // Sort tables based on sorting option
  const sortTables = useCallback((tables: LobbyTable[], sortBy: SortOption) => {
    const sortedTables = [...tables];
    
    switch (sortBy) {
      case 'activity':
        return sortedTables.sort((a, b) => {
          if (!a.last_activity || !b.last_activity) return 0;
          return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime();
        });
      case 'players':
        return sortedTables.sort((a, b) => b.current_players - a.current_players);
      case 'newest':
        return sortedTables.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      case 'blinds_asc':
        return sortedTables.sort((a, b) => a.small_blind - b.small_blind);
      case 'blinds_desc':
        return sortedTables.sort((a, b) => b.small_blind - a.small_blind);
      default:
        return sortedTables;
    }
  }, []);

  // Fetch tables with pagination
  const fetchTables = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = reset ? 0 : page;
      
      let query = supabase
        .from('lobby_tables')
        .select('*')
        .order('last_activity', { ascending: false });
        
      // Apply any server-side filters if needed
      if (filters.tableType !== 'ALL') {
        query = query.eq('table_type', filters.tableType);
      }
      
      if (!filters.showPrivate) {
        query = query.eq('is_private', false);
      }
      
      const { data, error } = await query
        .range(currentPage * TABLES_PER_PAGE, (currentPage + 1) * TABLES_PER_PAGE - 1);
        
      if (error) {
        console.error('Error fetching tables:', error);
        setError('Error al cargar mesas');
        return;
      }
      
      // Check if we've loaded all tables
      setHasMore(data.length === TABLES_PER_PAGE);
      
      if (reset) {
        setTables(data as LobbyTable[]);
        setPage(0);
      } else {
        setTables(prev => [...prev, ...(data as LobbyTable[])]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchTables:', err);
      setError('Ha ocurrido un error inesperado');
      setLoading(false);
    }
  }, [page, filters.tableType, filters.showPrivate]);

  // Load more tables
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Setup realtime subscription
  const setupRealtimeSubscription = useCallback(() => {
    const channel = supabase
      .channel('public:lobby_tables')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'lobby_tables' }, 
        payload => {
          const newTable = payload.new as LobbyTable;
          setTables(prevTables => [newTable, ...prevTables]);
          toast({
            title: "¡Nueva mesa disponible!",
            description: `"${newTable.name}" ha sido creada`,
          });
        })
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'lobby_tables' },
        payload => {
          const updatedTable = payload.new as LobbyTable;
          setTables(prevTables => 
            prevTables.map(table => 
              table.id === updatedTable.id ? updatedTable : table
            )
          );
        })
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'lobby_tables' },
        payload => {
          // Need to cast payload.old to any since we only get the id from delete events
          const deletedTableId = (payload.old as any).id;
          setTables(prevTables => 
            prevTables.filter(table => table.id !== deletedTableId)
          );
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTables(true);
  }, [filters.tableType, filters.showPrivate]);

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

  // Filtered tables based on client-side filters
  const filteredTables = useMemo(() => {
    return filterTablesHandler(tables, filters);
  }, [tables, filters, filterTablesHandler]);

  return {
    tables: filteredTables,
    allTables: tables,
    loading,
    error,
    hasMore,
    loadMore,
    filterTablesHandler,
    refreshTables: () => fetchTables(true)
  };
};
