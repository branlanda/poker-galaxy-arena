
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { optimizedSupabase } from '@/lib/optimizedSupabase';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import type { LobbyTable, TableFilters } from '@/types/lobby';

export function useLobbyTablesOptimized(filters?: TableFilters) {
  const [page, setPage] = useState(0);
  const [allTables, setAllTables] = useState<LobbyTable[]>([]);
  const { reducedData, compactMode } = useMobileOptimizations();
  
  // Adjust page size based on device capabilities
  const pageSize = useMemo(() => {
    if (reducedData) return 10;
    if (compactMode) return 15;
    return 20;
  }, [reducedData, compactMode]);
  
  // Optimized query with caching
  const { data: tables, isLoading, error, refetch } = useOptimizedQuery({
    queryKey: ['lobby-tables', page, pageSize, filters],
    queryFn: async () => {
      return optimizedSupabase.optimizedQuery<LobbyTable[]>(
        'lobby_tables',
        (query) => {
          let q = query
            .select(`
              id,
              name,
              table_type,
              small_blind,
              big_blind,
              min_buy_in,
              max_buy_in,
              max_players,
              current_players,
              status,
              is_private,
              created_at,
              creator_id
            `)
            .order('created_at', { ascending: false })
            .range(page * pageSize, (page + 1) * pageSize - 1);
          
          // Apply filters
          if (filters?.tableType && filters.tableType !== 'ALL') {
            q = q.eq('table_type', filters.tableType);
          }
          
          if (filters?.showActive) {
            q = q.in('status', ['WAITING', 'ACTIVE']);
          }
          
          if (filters?.blindsRange) {
            const [min, max] = filters.blindsRange;
            q = q.gte('big_blind', min).lte('big_blind', max);
          }
          
          return q;
        },
        {
          cache: true,
          ttl: reducedData ? 10000 : 5000,
          limit: pageSize,
          useIndex: ['created_at', 'status', 'table_type']
        }
      );
    },
    staleTime: reducedData ? 30000 : 10000,
    enabled: true,
  });
  
  // Update all tables when new data arrives
  useEffect(() => {
    if (tables) {
      if (page === 0) {
        setAllTables(tables);
      } else {
        setAllTables(prev => [...prev, ...tables]);
      }
    }
  }, [tables, page]);
  
  // Load more function
  const loadMore = useCallback(() => {
    if (!isLoading) {
      setPage(prev => prev + 1);
    }
  }, [isLoading]);
  
  // Refresh function
  const refreshTables = useCallback(() => {
    setPage(0);
    setAllTables([]);
    refetch();
  }, [refetch]);
  
  // Determine if has more data
  const hasMore = useMemo(() => {
    return tables?.length === pageSize;
  }, [tables?.length, pageSize]);
  
  // Real-time subscription with optimizations
  useEffect(() => {
    if (reducedData) return; // Skip real-time for slow connections
    
    const unsubscribe = optimizedSupabase.optimizedSubscription(
      'lobby_tables',
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setAllTables(prev => [payload.new as LobbyTable, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setAllTables(prev => 
            prev.map(table => 
              table.id === payload.new.id ? payload.new as LobbyTable : table
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setAllTables(prev => prev.filter(table => table.id !== payload.old.id));
        }
      },
      { throttle: 500 }
    );
    
    return unsubscribe;
  }, [reducedData]);
  
  return {
    tables: allTables,
    loading: isLoading,
    error,
    hasMore,
    loadMore,
    refreshTables,
    pageSize,
  };
}
