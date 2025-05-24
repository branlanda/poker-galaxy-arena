
import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export interface Alert {
  id: string;
  alertType: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'investigating' | 'resolved' | 'ignored';
  timestamp: string;
  userName: string;
  userId: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  active: boolean;
  severity: 'high' | 'medium' | 'low';
}

interface AlertState {
  alerts: Alert[];
  rules: AlertRule[];
  loading: boolean;
  error: string | null;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  fetchAlerts: () => Promise<void>;
  fetchRules: () => Promise<void>;
  toggleRule: (id: string) => Promise<void>;
  updateAlertStatus: (id: string, status: string) => Promise<void>;
  banUser: (userId: string) => Promise<void>;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  rules: [],
  loading: false,
  error: null,
  
  addAlert: (alert) =>
    set((state) => ({ alerts: [...state.alerts, alert] })),
    
  removeAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
    
  fetchAlerts: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data if needed to match the Alert interface
      const alerts: Alert[] = data.map((item: any) => ({
        id: item.id,
        alertType: item.type || 'Unknown',
        description: item.description,
        severity: item.severity || 'medium',
        status: item.resolved ? 'resolved' : 'new',
        timestamp: item.created_at,
        userName: item.metadata?.user_name || 'Unknown',
        userId: item.metadata?.user_id || '',
      }));

      set({ alerts, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast({
        title: 'Error fetching alerts',
        description: error.message,
        variant: 'destructive',
      });
    }
  },

  fetchRules: async () => {
    try {
      set({ loading: true });
      // Fetch rules from database
      const { data, error } = await supabase
        .from('fraud_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data if needed to match the AlertRule interface
      const rules: AlertRule[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        active: item.is_active,
        severity: item.severity || 'medium',
      }));

      set({ rules, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast({
        title: 'Error fetching rules',
        description: error.message,
        variant: 'destructive',
      });
    }
  },

  toggleRule: async (id) => {
    try {
      set({ loading: true });
      
      // Find the rule to toggle
      const ruleToUpdate = set.getState().rules.find(rule => rule.id === id);
      if (!ruleToUpdate) throw new Error('Rule not found');
      
      // Update in the database
      const { error } = await supabase
        .from('fraud_rules')
        .update({ is_active: !ruleToUpdate.active })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      set(state => ({
        rules: state.rules.map(rule => 
          rule.id === id ? { ...rule, active: !rule.active } : rule
        ),
        loading: false
      }));
      
      toast({
        title: 'Rule updated',
        description: `Rule "${ruleToUpdate.name}" has been ${!ruleToUpdate.active ? 'enabled' : 'disabled'}`,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast({
        title: 'Error updating rule',
        description: error.message,
        variant: 'destructive',
      });
    }
  },

  updateAlertStatus: async (id, status) => {
    try {
      set({ loading: true });
      
      // Update in the database - assuming 'resolved' field for simplicity
      const isResolved = status === 'resolved';
      const { error } = await supabase
        .from('alerts')
        .update({ 
          resolved: isResolved,
          resolved_at: isResolved ? new Date().toISOString() : null 
        })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      set(state => ({
        alerts: state.alerts.map(alert => 
          alert.id === id ? { ...alert, status } : alert
        ),
        loading: false
      }));
      
      toast({
        title: 'Alert updated',
        description: `Alert status changed to ${status}`,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast({
        title: 'Error updating alert',
        description: error.message,
        variant: 'destructive',
      });
    }
  },

  banUser: async (userId) => {
    try {
      set({ loading: true });
      
      // Call to a function that would handle user banning
      const { error } = await supabase.functions.invoke('ban-user', {
        body: { userId }
      });

      if (error) throw error;
      
      set({ loading: false });
      
      toast({
        title: 'User banned',
        description: 'The user has been banned from the platform',
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast({
        title: 'Error banning user',
        description: error.message,
        variant: 'destructive',
      });
    }
  }
}));
