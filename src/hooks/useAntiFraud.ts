
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertRule, useAlertStore } from '@/stores/alerts';

export interface FraudCheck {
  id: string;
  type: string;
  status: string;
  created_at: string;
  user_id: string;
  details: any;
}

export function useAntiFraud() {
  const [loading, setLoading] = useState(false);
  const [fraudChecks, setFraudChecks] = useState<FraudCheck[]>([]);
  const alertStore = useAlertStore();
  
  // Map alert store properties and methods directly
  const alerts = alertStore.alerts;
  const rules = alertStore.rules;
  const fetchAlerts = alertStore.fetchAlerts;
  const fetchRules = alertStore.fetchRules;
  const toggleRule = alertStore.toggleRule;
  const updateAlertStatus = alertStore.updateAlertStatus;
  const banUser = alertStore.banUser;
  
  const hasPendingChecks = fraudChecks.some(check => check.status === 'pending');
  
  const fetchFraudChecks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fraud_checks')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setFraudChecks(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch fraud checks: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const initiateCheck = async (checkType: string, details: any = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fraud_checks')
        .insert({
          type: checkType,
          status: 'pending',
          details
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setFraudChecks(prev => [data, ...prev]);
      
      toast({
        title: 'Fraud check initiated',
        description: `A new ${checkType} check has been initiated`,
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to initiate fraud check: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const submitVerification = async (checkId: string, documents: File[]) => {
    try {
      setLoading(true);
      
      // Upload documents to storage
      const uploadPromises = documents.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${checkId}/${Date.now()}.${fileExt}`;
        const filePath = `fraud-checks/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('verifications')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        return filePath;
      });
      
      const uploadedPaths = await Promise.all(uploadPromises);
      
      // Update fraud check with document paths
      const { error } = await supabase
        .from('fraud_checks')
        .update({ 
          document_paths: uploadedPaths,
          status: 'submitted',
          updated_at: new Date().toISOString()
        })
        .eq('id', checkId);
        
      if (error) throw error;
      
      // Update local state
      setFraudChecks(prev => 
        prev.map(check => 
          check.id === checkId 
            ? { ...check, status: 'submitted' } 
            : check
        )
      );
      
      toast({
        title: 'Verification submitted',
        description: 'Your verification documents have been submitted for review',
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to submit verification: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFraudChecks();
    fetchAlerts();
    fetchRules();
  }, [fetchAlerts, fetchRules]);

  return {
    loading,
    fraudChecks,
    hasPendingChecks,
    fetchFraudChecks,
    initiateCheck,
    submitVerification,
    // Properties and methods from alertStore
    alerts,
    rules,
    fetchAlerts,
    fetchRules,
    toggleRule,
    updateAlertStatus,
    banUser
  };
}
