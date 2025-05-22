
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { StoreAction } from './storeTypes';

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
      // Here would be the ethereum deposit functionality
      // For now we're simulating it with a direct API call
      
      const txId = `${Math.random().toString(36).substring(2, 15)}`;
      const timestamp = new Date();
      
      // Add pending transaction to state
      const transaction: Transaction = {
        id: txId,
        hash: `0x${Math.random().toString(36).substring(2, 15)}`,
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
        body: JSON.stringify({ amount: depositAmount }),
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
      // Here would be the ethereum withdraw functionality
      // For now we're simulating it with a direct API call
      
      const txId = `${Math.random().toString(36).substring(2, 15)}`;
      const timestamp = new Date();
      
      // Add pending transaction to state
      const transaction: Transaction = {
        id: txId,
        hash: `0x${Math.random().toString(36).substring(2, 15)}`,
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
        body: JSON.stringify({ address, amount: withdrawAmount }),
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
}));
