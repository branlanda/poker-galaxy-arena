
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  description: string;
  metadata?: any;
  created_at: string;
}

interface AuditLogsState {
  logs: AuditLog[];
  isLoading: boolean;
  filters: {
    action?: string;
    userId?: string;
    fromDate?: string;
    toDate?: string;
  };
  fetchLogs: () => Promise<void>;
  setFilters: (filters: Partial<AuditLogsState['filters']>) => void;
  exportLogs: (format: 'csv' | 'json') => Promise<void>;
}

export const useAuditLogsStore = create<AuditLogsState>((set, get) => ({
  logs: [],
  isLoading: false,
  filters: {},
  
  fetchLogs: async () => {
    try {
      set({ isLoading: true });
      const { filters } = get();
      
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.fromDate) {
        query = query.gte('created_at', filters.fromDate);
      }
      
      if (filters.toDate) {
        query = query.lte('created_at', filters.toDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      set({ logs: data || [] });
      
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch audit logs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  exportLogs: async (format) => {
    try {
      const { logs } = get();
      
      if (logs.length === 0) {
        toast({
          title: 'No Data',
          description: 'There are no logs to export.',
        });
        return;
      }
      
      if (format === 'csv') {
        // Convert logs to CSV
        const headers = Object.keys(logs[0]).join(',');
        const rows = logs.map(log => {
          return Object.values(log).map(value => {
            if (typeof value === 'object') {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',');
        });
        
        const csv = [headers, ...rows].join('\n');
        
        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Download JSON
        const json = JSON.stringify(logs, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: 'Export Successful',
        description: `Logs exported as ${format.toUpperCase()} successfully.`,
      });
      
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export logs. Please try again.',
        variant: 'destructive',
      });
    }
  }
}));
