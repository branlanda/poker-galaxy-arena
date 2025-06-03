
import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

interface OptimizedQueryOptions<TData> extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  enableOptimizations?: boolean;
  backgroundRefetch?: boolean;
}

export function useOptimizedQuery<TData>({
  queryKey,
  queryFn,
  enableOptimizations = true,
  backgroundRefetch = true,
  ...options
}: OptimizedQueryOptions<TData>) {
  
  // Memoize query key to prevent unnecessary re-renders
  const memoizedQueryKey = useMemo(() => queryKey, [JSON.stringify(queryKey)]);
  
  // Memoize query function
  const memoizedQueryFn = useCallback(queryFn, []);
  
  const optimizedOptions = useMemo(() => {
    if (!enableOptimizations) {
      return options;
    }
    
    return {
      ...options,
      staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes
      gcTime: options.gcTime ?? 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
      refetchOnMount: options.refetchOnMount ?? false,
      refetchOnReconnect: options.refetchOnReconnect ?? true,
      retry: options.retry ?? 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    };
  }, [options, enableOptimizations]);
  
  return useQuery({
    queryKey: memoizedQueryKey,
    queryFn: memoizedQueryFn,
    ...optimizedOptions,
  });
}

// Hook for paginated queries with optimizations
export function useOptimizedInfiniteQuery<TData>({
  queryKey,
  queryFn,
  enableOptimizations = true,
  ...options
}: any) {
  const memoizedQueryKey = useMemo(() => queryKey, [JSON.stringify(queryKey)]);
  
  const optimizedOptions = useMemo(() => {
    if (!enableOptimizations) {
      return options;
    }
    
    return {
      ...options,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      getNextPageParam: options.getNextPageParam,
      initialPageParam: options.initialPageParam ?? 0,
    };
  }, [options, enableOptimizations]);
  
  return useQuery({
    queryKey: memoizedQueryKey,
    queryFn: queryFn,
    ...optimizedOptions,
  });
}
