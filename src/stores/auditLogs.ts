
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface AuditLog {
  id: string;
  action: string;
  user_id?: string;
  description?: string;
  metadata?: any;
  created_at: string;
  userName?: string;
}

interface AuditLogsState {
  logs: AuditLog[];
  total: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  filters: {
    action?: string;
    userId?: string;
    dateRange?: [Date, Date];
    searchQuery?: string;
  };
}

interface AuditLogsActions {
  fetchLogs: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Partial<AuditLogsState['filters']>) => void;
  clearFilters: () => void;
  exportLogs: (format: 'csv' | 'json') => Promise<string>;
}

export const useAuditLogs = create<AuditLogsState & AuditLogsActions>((set, get) => ({
  logs: [],
  total: 0,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  filters: {},

  fetchLogs: async () => {
    try {
      set({ loading: true, error: null });

      const { currentPage, pageSize, filters } = get();
      const startRange = (currentPage - 1) * pageSize;
      const endRange = startRange + pageSize - 1;

      let query = supabase
        .from('audit_logs')
        .select('*, profiles!audit_logs_user_id_fkey(alias)', { count: 'exact' });

      // Apply filters
      if (filters.action) {
        query = query.eq('action', filters.action);
      }

      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters.dateRange) {
        query = query
          .gte('created_at', filters.dateRange[0].toISOString())
          .lte('created_at', filters.dateRange[1].toISOString());
      }

      if (filters.searchQuery) {
        query = query.or(`description.ilike.%${filters.searchQuery}%,action.ilike.%${filters.searchQuery}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(startRange, endRange);

      if (error) throw error;

      // Transform data to include userName from profiles relation
      const logs: AuditLog[] = data.map(log => ({
        ...log,
        userName: log.profiles?.alias || 'Unknown'
      }));

      set({
        logs,
        total: count || 0,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message,
        loading: false
      });

      toast({
        title: 'Error',
        description: `Failed to fetch audit logs: ${error.message}`,
        variant: 'destructive',
      });
    }
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchLogs();
  },

  setPageSize: (size) => {
    set({ pageSize: size, currentPage: 1 });
    get().fetchLogs();
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
      currentPage: 1
    }));
    get().fetchLogs();
  },

  clearFilters: () => {
    set({ filters: {}, currentPage: 1 });
    get().fetchLogs();
  },

  exportLogs: async (format) => {
    try {
      set({ loading: true });

      const { filters } = get();
      
      let query = supabase
        .from('audit_logs')
        .select('*, profiles!audit_logs_user_id_fkey(alias)');

      // Apply the same filters as for the view
      if (filters.action) {
        query = query.eq('action', filters.action);
      }

      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters.dateRange) {
        query = query
          .gte('created_at', filters.dateRange[0].toISOString())
          .lte('created_at', filters.dateRange[1].toISOString());
      }

      if (filters.searchQuery) {
        query = query.or(`description.ilike.%${filters.searchQuery}%,action.ilike.%${filters.searchQuery}%`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(log => ({
        ...log,
        userName: log.profiles?.alias || 'Unknown',
        // Format or clean up other fields as needed
        created_at: new Date(log.created_at).toLocaleString()
      }));

      let exportResult;
      
      if (format === 'csv') {
        // Convert to CSV
        const headers = ['id', 'action', 'userName', 'description', 'created_at'];
        const csvRows = [
          headers.join(','),
          ...formattedData.map(row => 
            headers.map(header => 
              JSON.stringify(row[header] || '')
            ).join(',')
          )
        ];
        exportResult = csvRows.join('\n');
      } else {
        // JSON format
        exportResult = JSON.stringify(formattedData, null, 2);
      }

      set({ loading: false });
      return exportResult;
    } catch (error: any) {
      set({ loading: false, error: error.message });
      
      toast({
        title: 'Export Failed',
        description: error.message,
        variant: 'destructive',
      });
      
      throw error;
    }
  }
}));
