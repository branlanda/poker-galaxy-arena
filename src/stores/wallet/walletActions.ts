
import { supabase } from '@/integrations/supabase/client';
import { ethers } from 'ethers';
import { WalletState, Transaction, TransactionStatus } from './types';
import { checkDepositSafety, checkWithdrawSafety } from './transactionUtils';

// Transaction-related actions
export const loadTransactions = async (set: any, get: () => WalletState) => {
  try {
    // Check if we have a connected wallet
    const address = get().address;
    if (!address) return;
    
    // Fetch transactions from Supabase
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }
    
    if (!transactions) return;
    
    // Transform the data into our store format
    const mappedTransactions: Transaction[] = transactions.map(tx => ({
      id: tx.id,
      hash: tx.blockchain_tx_hash || '',
      amount: tx.amount,
      type: tx.type.toLowerCase() as TransactionType,
      status: tx.status.toLowerCase() as TransactionStatus,
      timestamp: new Date(tx.created_at),
      description: tx.description || ''
    }));
    
    set({ transactions: mappedTransactions });
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
    
    // Generate transaction pending in our store
    const transaction: Transaction = {
      id: txId,
      hash: '',
      amount: amount,
      type: 'deposit',
      status: 'pending',
      timestamp,
      description: 'Deposit via Web3 wallet'
    };
    
    // Add pending transaction to state
    set({
      transactions: [transaction, ...get().transactions]
    });
    
    // Initialize provider
    if (!window.ethereum) throw new Error('No Web3 wallet found');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // For demo, we'll simulate a deposit transaction
    // In production, you would interact with an actual smart contract
    const tx = await signer.sendTransaction({
      to: "0x0000000000000000000000000000000000000000", // Replace with actual contract
      value: ethers.parseEther((amount * 0.00025).toString()), // Simulate USDT with small ETH amount
      data: "0x", // Contract function data would go here
    });
    
    // Update transaction with hash
    set({
      transactions: get().transactions.map(t => 
        t.id === txId ? { ...t, hash: tx.hash } : t
      )
    });
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    if (receipt && receipt.status === 1) {
      // Transaction successful - update state
      set({
        transactions: get().transactions.map(t => 
          t.id === txId ? { ...t, status: 'confirmed' as TransactionStatus } : t
        ),
        balance: get().balance + amount
      });
      
      // Save transaction to Supabase
      const user = await supabase.auth.getUser();
      await supabase.from('transactions').insert({
        id: txId,
        user_id: user.data.user?.id,
        type: 'deposit',
        amount: amount,
        status: 'confirmed',
        blockchain_tx_hash: tx.hash,
        description: 'Deposit via Web3 wallet'
      });
      
      return txId;
    } else {
      throw new Error('Transaction failed');
    }
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
    
    // Generate transaction pending in our store
    const transaction: Transaction = {
      id: txId,
      hash: '',
      amount: amount,
      type: 'withdraw',
      status: 'pending',
      timestamp,
      description: 'Withdrawal to external wallet'
    };
    
    // Add pending transaction to state
    set({
      transactions: [transaction, ...get().transactions]
    });
    
    // Initialize provider
    if (!window.ethereum) throw new Error('No Web3 wallet found');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // For demo, we'll simulate a withdrawal transaction
    // In production, you would interact with an actual smart contract
    const tx = await signer.sendTransaction({
      to: address,
      value: ethers.parseEther((amount * 0.00025).toString()), // Simulate USDT with small ETH amount
      data: "0x", // Contract function data would go here
    });
    
    // Update transaction with hash
    set({
      transactions: get().transactions.map(t => 
        t.id === txId ? { ...t, hash: tx.hash } : t
      )
    });
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    if (receipt && receipt.status === 1) {
      // Transaction successful - update state
      set({
        transactions: get().transactions.map(t => 
          t.id === txId ? { ...t, status: 'confirmed' as TransactionStatus } : t
        ),
        balance: get().balance - amount
      });
      
      // Save transaction to Supabase
      const user = await supabase.auth.getUser();
      await supabase.from('transactions').insert({
        id: txId,
        user_id: user.data.user?.id,
        type: 'withdrawal',
        amount: amount,
        status: 'confirmed',
        blockchain_tx_hash: tx.hash,
        description: 'Withdrawal to external wallet'
      });
      
      return txId;
    } else {
      throw new Error('Transaction failed');
    }
  } catch (error) {
    console.error('Withdrawal error:', error);
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
