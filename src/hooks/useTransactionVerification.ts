
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from './useAdmin';
import { useToast } from './use-toast';

export interface VerifiableTransaction {
  id: string;
  userName: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
  verificationStatus: 'unverified' | 'verified' | 'flagged';
}

export function useTransactionVerification() {
  const [transactions, setTransactions] = useState<VerifiableTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAdmin, createAuditLog } = useAdmin();
  const { toast } = useToast();

  // Mock data for demonstration purposes
  const mockTransactions: VerifiableTransaction[] = [
    {
      id: '1',
      userName: 'player123',
      userId: '123',
      type: 'deposit',
      amount: 500,
      createdAt: new Date().toISOString(),
      status: 'pending',
      verificationStatus: 'unverified'
    },
    {
      id: '2',
      userName: 'highroller42',
      userId: '456',
      type: 'withdrawal',
      amount: 1200,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'pending',
      verificationStatus: 'flagged'
    },
    {
      id: '3',
      userName: 'pokerface99',
      userId: '789',
      type: 'deposit',
      amount: 750,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      status: 'pending',
      verificationStatus: 'unverified'
    }
  ];

  const fetchPendingTransactions = useCallback(async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      // In a real implementation, we would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('transactions')
      //   .select('*, profiles(alias)')
      //   .eq('status', 'pending')
      //   .order('created_at', { ascending: false });
      
      // if (error) throw error;
      
      // Format the data for our component
      // const formattedTx = data.map(tx => ({
      //   id: tx.id,
      //   userName: tx.profiles.alias,
      //   userId: tx.user_id,
      //   type: tx.type,
      //   amount: tx.amount,
      //   createdAt: tx.created_at,
      //   status: tx.status,
      //   verificationStatus: tx.metadata?.verification_status || 'unverified'
      // }));
      
      // setTransactions(formattedTx);
      
      // For demo purposes, we'll use mock data
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending transactions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, toast]);

  const approveTransaction = useCallback(async (txId: string) => {
    if (!isAdmin) return;
    
    try {
      // Update local state immediately for responsive UI
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === txId 
            ? { ...tx, verificationStatus: 'verified', status: 'completed' } 
            : tx
        )
      );
      
      // In a real implementation, we would update in Supabase
      // Find the transaction we're approving
      const tx = transactions.find(t => t.id === txId);
      if (!tx) return;
      
      // Log this action
      await createAuditLog(
        'transaction_approved',
        `Approved ${tx.type} transaction for ${tx.amount}`,
        { transactionId: tx.id, userId: tx.userId, amount: tx.amount }
      );
      
      toast({
        title: 'Transaction Approved',
        description: `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} for ${tx.amount} has been approved`,
      });
    } catch (error) {
      console.error('Error approving transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve transaction',
        variant: 'destructive'
      });
      
      // Revert the local state change on error
      fetchPendingTransactions();
    }
  }, [isAdmin, transactions, createAuditLog, fetchPendingTransactions, toast]);

  const rejectTransaction = useCallback(async (txId: string) => {
    if (!isAdmin) return;
    
    try {
      // Update local state immediately for responsive UI
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === txId 
            ? { ...tx, status: 'failed' } 
            : tx
        )
      );
      
      // In a real implementation, we would update in Supabase
      // Find the transaction we're rejecting
      const tx = transactions.find(t => t.id === txId);
      if (!tx) return;
      
      // Log this action
      await createAuditLog(
        'transaction_rejected',
        `Rejected ${tx.type} transaction for ${tx.amount}`,
        { transactionId: tx.id, userId: tx.userId, amount: tx.amount }
      );
      
      toast({
        title: 'Transaction Rejected',
        description: `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} for ${tx.amount} has been rejected`,
        variant: 'destructive'
      });
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject transaction',
        variant: 'destructive'
      });
      
      // Revert the local state change on error
      fetchPendingTransactions();
    }
  }, [isAdmin, transactions, createAuditLog, fetchPendingTransactions, toast]);

  const flagTransaction = useCallback(async (txId: string) => {
    if (!isAdmin) return;
    
    try {
      // Update local state immediately for responsive UI
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === txId 
            ? { ...tx, verificationStatus: 'flagged' } 
            : tx
        )
      );
      
      // In a real implementation, we would update in Supabase
      // Find the transaction we're flagging
      const tx = transactions.find(t => t.id === txId);
      if (!tx) return;
      
      // Log this action
      await createAuditLog(
        'transaction_flagged',
        `Flagged ${tx.type} transaction for ${tx.amount} for review`,
        { transactionId: tx.id, userId: tx.userId, amount: tx.amount }
      );
      
      toast({
        title: 'Transaction Flagged',
        description: `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} has been flagged for review`,
        variant: 'warning'
      });
    } catch (error) {
      console.error('Error flagging transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to flag transaction',
        variant: 'destructive'
      });
      
      // Revert the local state change on error
      fetchPendingTransactions();
    }
  }, [isAdmin, transactions, createAuditLog, fetchPendingTransactions, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingTransactions();
    }
  }, [isAdmin, fetchPendingTransactions]);

  return { 
    transactions, 
    loading, 
    fetchPendingTransactions, 
    approveTransaction, 
    rejectTransaction, 
    flagTransaction
  };
}
