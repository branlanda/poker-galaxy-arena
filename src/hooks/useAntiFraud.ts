import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface FraudCheck {
  id: string;
  user_id: string;
  check_type: string;
  status: 'PENDING' | 'PASSED' | 'FAILED';
  details?: any;
  created_at: string;
  updated_at: string;
}

export function useAntiFraud() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fraudChecks, setFraudChecks] = useState<FraudCheck[]>([]);
  const [hasPendingChecks, setHasPendingChecks] = useState(false);

  // Fetch user's fraud checks
  const fetchFraudChecks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('fraud_checks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setFraudChecks(data || []);
      
      // Check if there are any pending checks
      const pending = data?.some(check => check.status === 'PENDING') || false;
      setHasPendingChecks(pending);
      
    } catch (error: any) {
      console.error('Error fetching fraud checks:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initiate a new fraud check
  const initiateCheck = async (checkType: string, details?: any) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('fraud_checks')
        .insert({
          user_id: user.id,
          check_type: checkType,
          status: 'PENDING',
          details
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Refresh the list
      await fetchFraudChecks();
      
      return data;
    } catch (error: any) {
      console.error('Error initiating fraud check:', error);
      toast({
        title: t('errors.checkFailed'),
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Submit verification documents
  const submitVerification = async (checkId: string, documents: File[]) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      
      // Upload each document to storage
      const uploadPromises = documents.map(async (doc, index) => {
        const fileName = `${user.id}/${checkId}/${index}-${doc.name}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('verification_docs')
          .upload(fileName, doc, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) throw uploadError;
        
        return fileName;
      });
      
      const uploadedFiles = await Promise.all(uploadPromises);
      
      // Update the check with file references
      const { error: updateError } = await supabase
        .from('fraud_checks')
        .update({
          details: {
            documents: uploadedFiles,
            submitted_at: new Date().toISOString()
          }
        })
        .eq('id', checkId)
        .eq('user_id', user.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: t('verification.documentsUploaded'),
        description: t('verification.underReview'),
      });
      
      // Refresh the list
      await fetchFraudChecks();
      
      return true;
    } catch (error: any) {
      console.error('Error submitting verification:', error);
      toast({
        title: t('errors.uploadFailed'),
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Load fraud checks when user changes
  useEffect(() => {
    if (user) {
      fetchFraudChecks();
    } else {
      setFraudChecks([]);
      setHasPendingChecks(false);
    }
  }, [user]);
  
  return {
    loading,
    fraudChecks,
    hasPendingChecks,
    fetchFraudChecks,
    initiateCheck,
    submitVerification
  };
}
