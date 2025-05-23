
import { supabase } from '@/integrations/supabase/client';
import { ethers } from 'ethers';
import { WalletState, Transaction, TransactionStatus } from './types';
import { checkDepositSafety, checkWithdrawSafety } from './transactionUtils';

// Transaction-related actions
export const loadTransactions = async (set: any, get: () => WalletState) => {
  try {
    const { data: ledgerData } = await supabase
      .from('ledger_entries')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!ledgerData) return;
    
    const transactions: Transaction[] = ledgerData.map(entry => ({
      id: entry.id.toString(), // Convert to string
      hash: entry.tx_hash || '',
      amount: entry.amount,
      type: entry.tx_type === 'DEPOSIT' ? 'deposit' : 'withdraw',
      status: ((entry.meta as any)?.status as TransactionStatus) || 'confirmed',
      timestamp: new Date(entry.created_at),
    }));
    
    set({ transactions });
  } catch (error) {
    console.error('Failed to load transactions:', error);
  }
};

export const depositFunds = async (amount: number, set: any, get: () => WalletState) => {
  try {
    // Anti-fraud check
    const { safe, reason } = await checkDepositSafety(amount);
    if (!safe) {
      throw new Error(reason || 'Transaction flagged for security reasons');
    }
    
    const txId = `${Math.random().toString(36).substring(2, 15)}`;
    const timestamp = new Date();
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    // Add pending transaction to state
    const transaction: Transaction = {
      id: txId,
      hash: txHash,
      amount: amount,
      type: 'deposit',
      status: 'pending',
      timestamp
    };
    
    set({
      transactions: [transaction, ...get().transactions]
    });
    
    // Call the deposit API
    const response = await fetch(`${import.meta.env.VITE_WALLET_API}/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        amount: amount, 
        wallet_address: get().address || undefined,
        tx_hash: txHash
      }),
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Deposit failed');
    }
    
    // Update transaction status
    set({
      transactions: get().transactions.map(tx =>
        tx.id === txId ? { ...tx, status: 'confirmed' as TransactionStatus } : tx
      ),
      balance: get().balance + amount,
    });
    
    return txId;
  } catch (error) {
    console.error('Deposit error:', error);
    return null;
  }
};

export const withdrawFunds = async (address: string, amount: number, set: any, get: () => WalletState) => {
  try {
    // Anti-fraud check
    const { safe, reason } = await checkWithdrawSafety(address, amount);
    if (!safe) {
      throw new Error(reason || 'Transaction flagged for security reasons');
    }
    
    const txId = `${Math.random().toString(36).substring(2, 15)}`;
    const timestamp = new Date();
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    // Add pending transaction to state
    const transaction: Transaction = {
      id: txId,
      hash: txHash,
      amount: amount,
      type: 'withdraw',
      status: 'pending',
      timestamp
    };
    
    set({
      transactions: [transaction, ...get().transactions]
    });
    
    // Call the withdraw API
    const response = await fetch(`${import.meta.env.VITE_WALLET_API}/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        address, 
        amount: amount,
        wallet_address: get().address || undefined,
        tx_hash: txHash
      }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Withdraw request failed');
    }
    
    // Update transaction status
    set({
      transactions: get().transactions.map(tx =>
        tx.id === txId ? { ...tx, status: 'confirmed' as TransactionStatus } : tx
      ),
      balance: get().balance - amount,
    });
    
    return txId;
  } catch (error) {
    console.error('Withdraw error:', error);
    return null;
  }
};

export const verifyTransactionHash = async (txHash: string) => {
  try {
    if (!window.ethereum) return false;
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt || receipt.status === 0) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Transaction verification error:', error);
    return false;
  }
};
