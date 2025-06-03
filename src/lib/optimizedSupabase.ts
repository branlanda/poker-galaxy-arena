
import { supabase } from '@/lib/supabase';

interface QueryCache {
  [key: string]: {
    data: any;
    timestamp: number;
    ttl: number;
  };
}

class OptimizedSupabaseClient {
  private cache: QueryCache = {};
  private defaultTTL = 5 * 60 * 1000;
  
  private generateCacheKey(query: string, params: any): string {
    return `${query}_${JSON.stringify(params)}`;
  }
  
  private isValidCache(cacheEntry: QueryCache[string]): boolean {
    return Date.now() - cacheEntry.timestamp < cacheEntry.ttl;
  }
  
  async optimizedQuery<T>(
    tableName: string,
    queryBuilder: (query: any) => any,
    options: {
      cache?: boolean;
      ttl?: number;
      select?: string;
      limit?: number;
      useIndex?: string[];
    } = {}
  ): Promise<T> {
    const {
      cache = true,
      ttl = this.defaultTTL,
      select = '*',
      limit,
      useIndex = []
    } = options;
    
    let query = supabase.from(tableName).select(select);
    
    const builtQuery = queryBuilder(query);
    
    if (limit) {
      builtQuery.limit(limit);
    }
    
    const cacheKey = this.generateCacheKey(tableName, { select, limit, query: builtQuery.toString() });
    
    if (cache && this.cache[cacheKey] && this.isValidCache(this.cache[cacheKey])) {
      return this.cache[cacheKey].data;
    }
    
    const { data, error } = await builtQuery;
    
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    
    if (cache) {
      this.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
        ttl
      };
    }
    
    return data as T;
  }
  
  optimizedSubscription(
    tableName: string,
    callback: (payload: any) => void,
    options: {
      filter?: string;
      throttle?: number;
    } = {}
  ) {
    const { filter, throttle = 100 } = options;
    
    let timeoutId: NodeJS.Timeout;
    let lastCall = 0;
    
    const throttledCallback = (payload: any) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall;
      
      if (timeSinceLastCall >= throttle) {
        callback(payload);
        lastCall = now;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          callback(payload);
          lastCall = Date.now();
        }, throttle - timeSinceLastCall);
      }
    };
    
    let subscription = supabase
      .channel(`${tableName}_changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: tableName,
          filter: filter 
        }, 
        throttledCallback
      )
      .subscribe();
    
    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }
  
  clearCache(pattern?: string) {
    if (pattern) {
      Object.keys(this.cache).forEach(key => {
        if (key.includes(pattern)) {
          delete this.cache[key];
        }
      });
    } else {
      this.cache = {};
    }
  }
  
  async prefetchData(queries: Array<{ table: string; queryFn: (q: any) => any; key: string }>) {
    const prefetchPromises = queries.map(async ({ table, queryFn, key }) => {
      try {
        await this.optimizedQuery(table, queryFn, { cache: true, ttl: this.defaultTTL });
      } catch (error) {
        console.warn(`Prefetch failed for ${key}:`, error);
      }
    });
    
    await Promise.allSettled(prefetchPromises);
  }
}

export const optimizedSupabase = new OptimizedSupabaseClient();
