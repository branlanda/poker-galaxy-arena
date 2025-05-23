
import { create } from 'zustand';
import { WalletState, WalletActions } from './types';
import { loadTransactions, depositFunds, withdrawFunds, verifyTransactionHash } from './walletActions';

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
  loadTransactions: async () => loadTransactions(set, get),
  depositFunds: async (amount) => depositFunds(amount, set, get),
  withdrawFunds: async (address, amount) => withdrawFunds(address, amount, set, get),
  verifyTransactionHash
}));

// Re-export types for convenience
export * from './types';
