import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface AlertState {
  alerts: any[];
  addAlert: (alert: any) => void;
  removeAlert: (id: string) => void;
  fetchAlerts: (userId: string) => Promise<void>;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  addAlert: (alert) =>
    set((state) => ({ alerts: [...state.alerts, alert] })),
  removeAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
  fetchAlerts: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      set({ alerts: data || [] });
    } catch (error: any) {
      toast({
        title: 'Error fetching alerts',
        description: error.message,
        variant: 'destructive',
      });
    }
  },
}));

