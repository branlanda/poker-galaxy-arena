
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type AlertSeverity = 'low' | 'medium' | 'high';

export interface Alert {
  id: string;
  type: string;
  severity: AlertSeverity;
  description: string;
  created_at: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  metadata?: any;
}

interface AlertsState {
  alerts: Alert[];
  isLoading: boolean;
  fetchAlerts: () => Promise<void>;
  resolveAlert: (id: string) => Promise<void>;
  createAlert: (alert: Omit<Alert, 'id' | 'created_at' | 'resolved' | 'resolved_at' | 'resolved_by'>) => Promise<void>;
}

export const useAlertsStore = create<AlertsState>((set, get) => ({
  alerts: [],
  isLoading: false,
  
  fetchAlerts: async () => {
    try {
      set({ isLoading: true });
      
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map the data to ensure severity is of type AlertSeverity
      const typedAlerts: Alert[] = data?.map(alert => ({
        ...alert,
        severity: alert.severity as AlertSeverity // Type assertion to handle the string to AlertSeverity conversion
      })) || [];
      
      set({ alerts: typedAlerts });
      
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch alerts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  resolveAlert: async (id) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      if (!currentUser?.user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('alerts')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: currentUser.user.id
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: currentUser.user.id,
        action: 'RESOLVE_ALERT',
        description: `Alert ${id} resolved`,
        metadata: { alertId: id }
      });
      
      // Update local state
      set((state) => ({
        alerts: state.alerts.map(alert =>
          alert.id === id 
            ? { 
                ...alert, 
                resolved: true, 
                resolved_at: new Date().toISOString(),
                resolved_by: currentUser.user.id
              } 
            : alert
        )
      }));
      
      toast({
        title: 'Alert Resolved',
        description: 'The alert has been marked as resolved.',
      });
      
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: 'Action Failed',
        description: 'Failed to resolve alert. Please try again.',
        variant: 'destructive',
      });
    }
  },
  
  createAlert: async (alert) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .insert({
          type: alert.type,
          severity: alert.severity,
          description: alert.description,
          metadata: alert.metadata || {}
        });
      
      if (error) throw error;
      
      // Refresh alerts
      get().fetchAlerts();
      
      toast({
        title: 'Alert Created',
        description: 'A new alert has been created.',
      });
      
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: 'Action Failed',
        description: 'Failed to create alert. Please try again.',
        variant: 'destructive',
      });
    }
  }
}));
