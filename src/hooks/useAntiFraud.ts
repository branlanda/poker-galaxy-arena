
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface FraudDetectionRule {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  active: boolean;
}

interface FraudAlert {
  id: string;
  userId: string;
  userName: string;
  alertType: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
}

export function useAntiFraud() {
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<FraudDetectionRule[]>([]);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Fetch fraud detection rules
  const fetchRules = useCallback(async () => {
    setLoading(true);
    
    // In a real implementation, this would fetch from the database
    // This is mock data
    setTimeout(() => {
      setRules([
        {
          id: '1',
          name: 'Multiple accounts from same IP',
          description: 'Detects when multiple accounts are created from the same IP address within a short time period',
          severity: 'medium',
          active: true
        },
        {
          id: '2',
          name: 'Unusual deposit patterns',
          description: 'Identifies unusual deposit patterns that may indicate money laundering',
          severity: 'high',
          active: true
        },
        {
          id: '3',
          name: 'Bot detection',
          description: 'Detects potential bot usage based on play patterns and timing',
          severity: 'high',
          active: true
        },
        {
          id: '4',
          name: 'Collusion detection',
          description: 'Analyzes play patterns across tables to identify potential collusion between players',
          severity: 'high',
          active: true
        },
        {
          id: '5',
          name: 'Multiple account policy violation',
          description: 'Identifies players who may be using multiple accounts in the same game',
          severity: 'medium',
          active: true
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Fetch fraud alerts
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    
    // In a real implementation, this would fetch from the database
    // This is mock data
    setTimeout(() => {
      setAlerts([
        {
          id: '1',
          userId: 'user1',
          userName: 'JohnDoe',
          alertType: 'Multiple accounts from same IP',
          description: '3 accounts created from IP 192.168.1.1 within 1 hour',
          severity: 'medium',
          timestamp: new Date().toISOString(),
          status: 'new'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'PokerMaster',
          alertType: 'Unusual deposit patterns',
          description: 'Multiple small deposits followed by large withdrawal',
          severity: 'high',
          timestamp: new Date().toISOString(),
          status: 'investigating'
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'RoyalFlush',
          alertType: 'Potential collusion',
          description: 'Suspicious play patterns with user JackAce',
          severity: 'high',
          timestamp: new Date().toISOString(),
          status: 'new'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Toggle rule status
  const toggleRule = useCallback(async (ruleId: string) => {
    setRules(prevRules => 
      prevRules.map(rule => 
        rule.id === ruleId ? { ...rule, active: !rule.active } : rule
      )
    );
    
    toast({
      title: t('admin.ruleStatusUpdated'),
      description: t('admin.ruleStatusUpdateSuccess'),
      variant: "default",
    });
  }, [toast, t]);

  // Update alert status
  const updateAlertStatus = useCallback(async (alertId: string, status: 'new' | 'investigating' | 'resolved' | 'false_positive') => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, status } : alert
      )
    );
    
    toast({
      title: t('admin.alertStatusUpdated'),
      description: t('admin.alertStatusUpdateSuccess'),
      variant: "default",
    });
  }, [toast, t]);

  // Ban user
  const banUser = useCallback(async (userId: string) => {
    try {
      // In a real implementation, this would update the database
      console.log(`Banning user: ${userId}`);
      
      toast({
        title: t('admin.userBanned'),
        description: t('admin.userBanSuccess'),
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error banning user:', error);
      
      toast({
        title: t('admin.error'),
        description: t('admin.userBanError'),
        variant: "destructive",
      });
    }
  }, [toast, t]);

  // Reset rules to default
  const resetRulesToDefault = useCallback(async () => {
    try {
      // In a real implementation, this would reset rules in the database
      console.log('Resetting rules to default');
      await fetchRules();
      
      toast({
        title: t('admin.rulesReset'),
        description: t('admin.rulesResetSuccess'),
        variant: "default",
      });
    } catch (error) {
      console.error('Error resetting rules:', error);
      
      toast({
        title: t('admin.error'),
        description: t('admin.rulesResetError'),
        variant: "destructive",
      });
    }
  }, [fetchRules, toast, t]);

  return {
    rules,
    alerts,
    loading,
    fetchRules,
    fetchAlerts,
    toggleRule,
    updateAlertStatus,
    banUser,
    resetRulesToDefault
  };
}
