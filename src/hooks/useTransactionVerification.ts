
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface PendingTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  status: string;
  blockchain_tx_hash?: string;
  created_at: string;
  verificationStatus?: 'unverified' | 'verified' | 'flagged';
  userName?: string;
}

export function useTransactionVerification() {
  const [verifying, setVerifying] = useState(false);
  const [transactions, setTransactions] = useState<PendingTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles:user_id (alias)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = data?.map(tx => ({
        ...tx,
        userName: tx.profiles?.alias || 'Unknown',
        verificationStatus: 'unverified' as const
      })) || [];

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
      
      // Mock verification - in real app this would check blockchain
      const isValid = transactionHash && transactionHash.length > 10;
      
      if (isValid) {
        // Update transaction status
        const { error } = await supabase
          .from('transactions')
          .update({ status: 'confirmed' })
          .eq('blockchain_tx_hash', transactionHash);

        if (error) throw error;

        toast({
          title: 'Transaction verified',
          description: 'Transaction has been successfully verified',
        });

        // Refresh the list
        await fetchPendingTransactions();
        
        return { success: true };
      } else {
        throw new Error('Invalid transaction hash');
      }
    } catch (error: any) {
      toast({
        title: 'Verification failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setVerifying(false);
    }
  };

  const approveTransaction = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'confirmed' })
        .eq('id', transactionId);

      if (error) throw error;

      toast({
        title: 'Transaction approved',
        description: 'Transaction has been approved',
      });

      await fetchPendingTransactions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const rejectTransaction = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transactionId);

      if (error) throw error;

      toast({
        title: 'Transaction rejected',
        description: 'Transaction has been rejected',
      });

      await fetchPendingTransactions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const flagTransaction = async (transactionId: string) => {
    try {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === transactionId 
            ? { ...tx, verificationStatus: 'flagged' as const }
            : tx
        )
      );

      toast({
        title: 'Transaction flagged',
        description: 'Transaction has been flagged for review',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    verifying,
    transactions,
    loading,
    fetchPendingTransactions,
    verifyTransaction,
    approveTransaction,
    rejectTransaction,
    flagTransaction
  };
}
