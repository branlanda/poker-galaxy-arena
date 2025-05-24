
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface VerifiableTransaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  userName: string;
  userId: string;
  verificationStatus: 'unverified' | 'verified' | 'flagged';
}

export function useTransactionVerification() {
  const [transactions, setTransactions] = useState<VerifiableTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const fetchPendingTransactions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`*, profiles(alias)`)
        .in('status', ['pending', 'processing'])
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to match the VerifiableTransaction interface
      const transformedData: VerifiableTransaction[] = (data || []).map((item: any) => ({
        id: item.id,
        type: item.type,
        amount: item.amount,
        status: item.status,
        createdAt: item.created_at,
        userName: item.profiles?.alias || 'Unknown',
        userId: item.user_id,
        verificationStatus: item.metadata?.verification_status || 'unverified'
      }));
      
      setTransactions(transformedData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch pending transactions: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyTransaction = async (transactionHash: string) => {
    try {
      setVerifying(true);
      
      const { data, error } = await supabase.functions.invoke('verify-transaction', {
        body: { transactionHash }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Transaction verified',
        description: data.verified
          ? 'Transaction has been verified successfully'
          : 'Transaction verification failed',
        variant: data.verified ? 'default' : 'destructive',
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to verify transaction: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setVerifying(false);
    }
  };
  
  const approveTransaction = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          metadata: { verification_status: 'verified' } 
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === id 
            ? { ...tx, status: 'completed', verificationStatus: 'verified' } 
            : tx
        )
      );
      
      toast({
        title: 'Transaction approved',
        description: 'The transaction has been approved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to approve transaction: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const rejectTransaction = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'rejected'
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === id 
            ? { ...tx, status: 'rejected' } 
            : tx
        )
      );
      
      toast({
        title: 'Transaction rejected',
        description: 'The transaction has been rejected',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to reject transaction: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const flagTransaction = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('transactions')
        .update({ 
          metadata: { verification_status: 'flagged' } 
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === id 
            ? { ...tx, verificationStatus: 'flagged' } 
            : tx
        )
      );
      
      // Create alert for flagged transaction
      await supabase
        .from('alerts')
        .insert({
          type: 'SUSPICIOUS_TRANSACTION',
          severity: 'high',
          description: `Transaction ${id} has been flagged for review`,
          metadata: {
            transaction_id: id,
            amount: transactions.find(tx => tx.id === id)?.amount,
            user_id: transactions.find(tx => tx.id === id)?.userId
          }
        });
      
      toast({
        title: 'Transaction flagged',
        description: 'The transaction has been flagged for review',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to flag transaction: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  return {
    verifyTransaction,
    verifying,
    transactions,
    loading,
    fetchPendingTransactions,
    approveTransaction,
    rejectTransaction,
    flagTransaction
  };
}
