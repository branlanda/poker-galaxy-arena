
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from './useAdmin';
import { useAuth } from '@/stores/auth';
import { useToast } from './use-toast';

export interface FraudAlert {
  id: string;
  alertType: string;
  description: string;
  userName: string;
  userId: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  timestamp: string;
}

export interface FraudRule {
  id: string;
  name: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  active: boolean;
}

export function useAntiFraud() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [rules, setRules] = useState<FraudRule[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAdmin, createAuditLog } = useAdmin();
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data for demonstration purposes
  const mockAlerts: FraudAlert[] = [
    {
      id: '1',
      alertType: 'Multiple rapid deposits',
      description: 'User made 5 deposits in 10 minutes',
      userName: 'player123',
      userId: '123',
      severity: 'medium',
      status: 'new',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      alertType: 'Unusual withdrawal pattern',
      description: 'Withdrawal immediately after deposit',
      userName: 'highroller42',
      userId: '456',
      severity: 'high',
      status: 'investigating',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '3',
      alertType: 'IP address mismatch',
      description: 'Login from unusual location',
      userName: 'pokerface99',
      userId: '789',
      severity: 'low',
      status: 'new',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  const mockRules: FraudRule[] = [
    {
      id: '1',
      name: 'Multiple rapid deposits',
      description: 'Detects when a user makes multiple deposits in a short time frame',
      severity: 'medium',
      active: true
    },
    {
      id: '2',
      name: 'Withdrawal after deposit',
      description: 'Flags withdrawals made shortly after deposits',
      severity: 'high',
      active: true
    },
    {
      id: '3',
      name: 'IP geolocation change',
      description: 'Detects logins from unusual locations',
      severity: 'medium',
      active: true
    },
    {
      id: '4',
      name: 'Multiple account pattern',
      description: 'Identifies potential multi-accounting based on behavior patterns',
      severity: 'high',
      active: false
    }
  ];

  const fetchAlerts = useCallback(async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      // In a real implementation, we would fetch from Supabase
      // const { data, error } = await supabase.from('alerts')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      
      // if (error) throw error;
      // setAlerts(data || []);
      
      // For demo purposes, we'll use mock data
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load alerts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, toast]);

  const fetchRules = useCallback(async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      // In a real implementation, we would fetch from Supabase
      // For demo purposes, we'll use mock data
      setRules(mockRules);
    } catch (error) {
      console.error('Error fetching fraud rules:', error);
      toast({
        title: 'Error',
        description: 'Failed to load fraud rules',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, toast]);

  const toggleRule = useCallback(async (ruleId: string) => {
    if (!isAdmin) return;
    
    try {
      // Update local state immediately for responsive UI
      setRules(prev => 
        prev.map(rule => 
          rule.id === ruleId 
            ? { ...rule, active: !rule.active } 
            : rule
        )
      );
      
      // In a real implementation, we would update in Supabase
      // Find the rule we're toggling
      const rule = rules.find(r => r.id === ruleId);
      if (!rule) return;
      
      // Log this action
      await createAuditLog(
        rule.active ? 'rule_disabled' : 'rule_enabled',
        `${rule.active ? 'Disabled' : 'Enabled'} fraud rule: ${rule.name}`
      );
      
      toast({
        title: 'Rule Updated',
        description: `Rule "${rule.name}" has been ${rule.active ? 'disabled' : 'enabled'}`,
      });
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to update rule',
        variant: 'destructive'
      });
      
      // Revert the local state change on error
      fetchRules();
    }
  }, [isAdmin, rules, createAuditLog, fetchRules, toast]);

  const updateAlertStatus = useCallback(async (alertId: string, newStatus: FraudAlert['status']) => {
    if (!isAdmin) return;
    
    try {
      // Update local state immediately for responsive UI
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: newStatus } 
            : alert
        )
      );
      
      // In a real implementation, we would update in Supabase
      // Find the alert we're updating
      const alert = alerts.find(a => a.id === alertId);
      if (!alert) return;
      
      // Log this action
      await createAuditLog(
        'alert_status_changed',
        `Changed alert status from ${alert.status} to ${newStatus}`,
        { alertId, previousStatus: alert.status, newStatus }
      );
      
      toast({
        title: 'Alert Updated',
        description: `Alert status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating alert status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update alert status',
        variant: 'destructive'
      });
      
      // Revert the local state change on error
      fetchAlerts();
    }
  }, [isAdmin, alerts, createAuditLog, fetchAlerts, toast]);

  const banUser = useCallback(async (userId: string) => {
    if (!isAdmin) return;
    
    try {
      // In a real implementation, we would:
      // 1. Update the user status in the database
      // 2. Possibly revoke their session tokens
      // 3. Log the action
      
      // For demo purposes, we'll just log the action
      await createAuditLog(
        'user_banned',
        `User ${userId} has been banned`,
        { userId }
      );
      
      // Update alert status if this was triggered from an alert
      const relatedAlert = alerts.find(a => a.userId === userId);
      if (relatedAlert) {
        updateAlertStatus(relatedAlert.id, 'resolved');
      }
      
      toast({
        title: 'User Banned',
        description: 'User has been banned from the platform',
      });
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: 'Error',
        description: 'Failed to ban user',
        variant: 'destructive'
      });
    }
  }, [isAdmin, alerts, createAuditLog, updateAlertStatus, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchAlerts();
      fetchRules();
    }
  }, [isAdmin, fetchAlerts, fetchRules]);

  return { 
    alerts, 
    rules, 
    loading, 
    fetchAlerts, 
    fetchRules, 
    toggleRule, 
    updateAlertStatus, 
    banUser 
  };
}
