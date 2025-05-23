
import { supabase } from '@/lib/supabase';
import { Transaction, TransactionStatus } from './types';

export const loadTransactions = async (set: any, get: any) => {
  try {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading transactions:', error);
      return;
    }
    
    if (data) {
      set({ transactions: data });
    }
  } catch (error) {
    console.error('Error in loadTransactions action:', error);
  }
};

export const depositFunds = async (amount: number, set: any, get: any) => {
  try {
    const { address } = get();
    if (!address) throw new Error('No wallet connected');
    
    const { data, error } = await supabase.functions.invoke('deposit-funds', {
      body: { amount, address }
    });
    
    if (error) throw error;
    
    // Add transaction to local state
    const transaction: Transaction = {
      id: data.transaction_id,
      type: 'DEPOSIT',
      amount,
      status: TransactionStatus.PENDING,
      hash: data.txHash || null,
      created_at: new Date().toISOString()
    };
    
    get().addTransaction(transaction);
    return transaction;
  } catch (error: any) {
    console.error('Error in deposit action:', error);
    throw error;
  }
};

export const withdrawFunds = async (address: string, amount: number, set: any, get: any) => {
  try {
    if (!address) throw new Error('No withdrawal address provided');
    
    const { data, error } = await supabase.functions.invoke('withdraw-funds', {
      body: { amount, address }
    });
    
    if (error) throw error;
    
    // Add transaction to local state
    const transaction: Transaction = {
      id: data.transaction_id,
      type: 'WITHDRAW',
      amount,
      status: TransactionStatus.PENDING,
      hash: data.txHash || null,
      created_at: new Date().toISOString()
    };
    
    get().addTransaction(transaction);
    return transaction;
  } catch (error: any) {
    console.error('Error in withdraw action:', error);
    throw error;
  }
};

export const verifyTransactionHash = async (txHash: string, set: any, get: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-transaction', {
      body: { transactionHash: txHash }
    });
    
    if (error) throw error;
    
    // If transaction exists in local state, update it
    const txId = data.transaction_id;
    const status = data.verified ? TransactionStatus.COMPLETED : TransactionStatus.FAILED;
    
    if (txId) {
      get().updateTransaction(txId, status);
    }
    
    return data;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    throw error;
  }
};
