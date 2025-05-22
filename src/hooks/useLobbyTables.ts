import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LobbyTable, TableFilters, DEFAULT_FILTERS } from '@/types/lobby';

export const useLobbyTables = () => {
  const [tables, setTables] = useState<LobbyTable[]>([]);
  const [filteredTables, setFilteredTables] = useState<LobbyTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterTablesHandler = (filters: TableFilters) => {
    setLoading(true);
    
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
    
    setFilteredTables(results);
    setLoading(false);
  };

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cast result to any to bypass type errors until Supabase types are regenerated
      const { data, error } = await supabase
        .from('lobby_tables')
        .select('*')
        .order('last_activity', { ascending: false }) as { data: any, error: any };
        
      if (error) {
        console.error('Error fetching tables:', error);
        setError('Failed to load tables');
        return;
      }
      
      // Cast data to LobbyTable[] to satisfy TypeScript
      setTables(data as unknown as LobbyTable[]);
      
      // Set initial filtered tables based on default filters
      filterTablesHandler(DEFAULT_FILTERS);
    } catch (err) {
      console.error('Error in fetchTables:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return {
    tables,
    filteredTables,
    loading,
    error,
    filterTablesHandler
  };
};
