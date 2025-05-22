
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { StoreAction } from './storeTypes';
import { useToast } from '@/hooks/use-toast';

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export type TransactionType = 'deposit' | 'withdraw';

export interface Transaction {
  id: string;
  hash: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: Date;
}

// Define state interface
export interface WalletState {
  address: string | null;
  balance: number;
  ethBalance: string | null;
  connecting: boolean;
  transactions: Transaction[];
}

// Define actions interface without StoreAction constraint
export interface WalletActions {
  setAddress: (address: string | null) => void;
  setBalance: (balance: number) => void;
  setEthBalance: (ethBalance: string | null) => void;
  setConnecting: (connecting: boolean) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, status: TransactionStatus) => void;
  loadTransactions: () => Promise<void>;
  depositFunds: (amount: number) => Promise<string | null>;
  withdrawFunds: (address: string, amount: number) => Promise<string | null>;
  verifyTransactionHash: (txHash: string) => Promise<boolean>;
}

// Create the store
export const useWalletStore = create<WalletState & WalletActions>((set, get) => ({
  address: null,
  balance: 0,
  ethBalance: null,
  connecting: false,
  transactions: [],
  
  // Sync actions
  setAddress: (address) => set({ address }),
  setBalance: (balance) => set({ balance }),
  setEthBalance: (ethBalance) => set({ ethBalance }),
  setConnecting: (connecting) => set({ connecting }),
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),
  
  updateTransaction: (id, status) => set((state) => ({
    transactions: state.transactions.map(tx => 
      tx.id === id ? { ...tx, status } : tx
    )
  })),
  
  // Async actions
  loadTransactions: async () => {
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
  },
  
  depositFunds: async (depositAmount) => {
    try {
      // Anti-fraud check
      const { safe, reason } = await checkDepositSafety(depositAmount);
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
        amount: depositAmount,
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
          amount: depositAmount, 
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
        balance: get().balance + depositAmount,
      });
      
      return txId;
    } catch (error) {
      console.error('Deposit error:', error);
      return null;
    }
  },
  
  withdrawFunds: async (address, withdrawAmount) => {
    try {
      // Anti-fraud check
      const { safe, reason } = await checkWithdrawSafety(address, withdrawAmount);
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
        amount: withdrawAmount,
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
          amount: withdrawAmount,
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
        balance: get().balance - withdrawAmount,
      });
      
      return txId;
    } catch (error) {
      console.error('Withdraw error:', error);
      return null;
    }
  },
  
  verifyTransactionHash: async (txHash) => {
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
  }
}));

// Helper functions for fraud prevention
async function checkDepositSafety(amount: number): Promise<{safe: boolean, reason?: string}> {
  // Implement basic deposit safety checks
  if (amount <= 0) {
    return { safe: false, reason: 'Invalid deposit amount' };
  }
  
  if (amount > 10000) {
    return { safe: false, reason: 'Deposit amount exceeds maximum limit' };
  }
  
  return { safe: true };
}

async function checkWithdrawSafety(address: string, amount: number): Promise<{safe: boolean, reason?: string}> {
  // Validate TRC20 address for withdrawals
  if (!/^T[A-Za-z0-9]{33}$/.test(address)) {
    return { safe: false, reason: 'Invalid TRC20 address' };
  }
  
  if (amount <= 0) {
    return { safe: false, reason: 'Invalid withdrawal amount' };
  }
  
  if (amount > 10000) {
    return { safe: false, reason: 'Withdrawal amount exceeds maximum limit' };
  }
  
  return { safe: true };
}
