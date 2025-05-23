import { create } from 'zustand';
import { AdminAction } from '@/types/admin';
import { supabase } from '@/lib/supabase';

interface AuditLogState {
  logs: AdminAction[];
  loading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
}

export const useAuditLogs = create<AuditLogState>((set) => ({
  logs: [],
  loading: false,
  error: null,
  fetchLogs: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      set({ logs: data || [], error: null });
    } catch (error: any) {
      set({ error: error.message, logs: [] });
    } finally {
      set({ loading: false });
    }
  },
}));

