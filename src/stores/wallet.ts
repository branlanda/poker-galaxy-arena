
import { create } from 'zustand';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { StoreAction, Store, StoreDefinition } from './storeTypes';

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

// Define actions with proper typing
export interface WalletActions {
  setAddress: StoreAction<WalletState, [string | null]>;
  setBalance: StoreAction<WalletState, [number]>;
  setEthBalance: StoreAction<WalletState, [string | null]>;
  setConnecting: StoreAction<WalletState, [boolean]>;
  addTransaction: StoreAction<WalletState, [Transaction]>;
  updateTransaction: StoreAction<WalletState, [string, TransactionStatus]>;
  loadTransactions: StoreAction<WalletState, [], Promise<void>>;
  depositFunds: StoreAction<WalletState, [number], Promise<string | null>>;
  withdrawFunds: StoreAction<WalletState, [string, number], Promise<string | null>>;
}

// Define store
const walletStore: StoreDefinition<WalletState, WalletActions> = {
  state: {
    address: null,
    balance: 0,
    ethBalance: null,
    connecting: false,
    transactions: [],
  },
  
  actions: {
    setAddress: (state, address) => ({ ...state, address }),
    setBalance: (state, balance) => ({ ...state, balance }),
    setEthBalance: (state, ethBalance) => ({ ...state, ethBalance }),
    setConnecting: (state, connecting) => ({ ...state, connecting }),
    
    addTransaction: (state, transaction) => ({
      ...state,
      transactions: [transaction, ...state.transactions],
    }),
    
    updateTransaction: (state, id, status) => ({
      ...state,
      transactions: state.transactions.map(tx => 
        tx.id === id ? { ...tx, status } : tx
      ),
    }),
    
    loadTransactions: async (get, set) => {
      try {
        const { data: ledgerData } = await supabase
          .from('ledger_entries')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!ledgerData) return;
        
        const transactions: Transaction[] = ledgerData.map(entry => ({
          id: entry.id,
          hash: entry.tx_hash || '',
          amount: entry.amount,
          type: entry.tx_type === 'DEPOSIT' ? 'deposit' : 'withdraw',
          status: entry.meta?.status || 'confirmed',
          timestamp: new Date(entry.created_at),
        }));
        
        set({ transactions });
      } catch (error) {
        console.error('Failed to load transactions:', error);
      }
    },
    
    depositFunds: async (get, set) => {
      try {
        // Here would be the ethereum deposit functionality
        // For now we're simulating it with a direct API call
        
        const txId = `${Math.random().toString(36).substring(2, 15)}`;
        const timestamp = new Date();
        
        // Add pending transaction to state
        set({
          transactions: [
            {
              id: txId,
              hash: `0x${Math.random().toString(36).substring(2, 15)}`,
              amount,
              type: 'deposit',
              status: 'pending',
              timestamp,
            },
            ...get().transactions,
          ],
        });
        
        // Call the deposit API
        const response = await fetch(`${import.meta.env.VITE_WALLET_API}/deposit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
          credentials: 'include',
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
    },
    
    withdrawFunds: async (get, set, address, amount) => {
      try {
        // Here would be the ethereum withdraw functionality
        // For now we're simulating it with a direct API call
        
        const txId = `${Math.random().toString(36).substring(2, 15)}`;
        const timestamp = new Date();
        
        // Add pending transaction to state
        set({
          transactions: [
            {
              id: txId,
              hash: `0x${Math.random().toString(36).substring(2, 15)}`,
              amount,
              type: 'withdraw',
              status: 'pending',
              timestamp,
            },
            ...get().transactions,
          ],
        });
        
        // Call the withdraw API
        const response = await fetch(`${import.meta.env.VITE_WALLET_API}/withdraw`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address, amount }),
          credentials: 'include',
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
    },
  },
};

// Create the store
export const useWalletStore = create<Store<WalletState, WalletActions>>((set, get) => {
  const store = {
    ...walletStore.state,
    ...Object.entries(walletStore.actions).reduce((acc, [key, action]) => {
      acc[key] = (...args: any[]) => action(get(), set, ...args);
      return acc;
    }, {} as any),
  };
  
  return store;
});
