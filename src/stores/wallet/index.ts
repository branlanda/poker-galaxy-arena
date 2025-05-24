
import { create } from 'zustand';
import { WalletState, WalletActions, Transaction } from './types';

// Create the store with proper initial state
export const useWalletStore = create<WalletState & WalletActions>((set, get) => ({
  // State
  address: null,
  balance: 0,
  ethBalance: null,
  connecting: false,
  transactions: [],
  loading: false,
  error: null,
  pendingDeposit: false,
  pendingWithdrawal: false,
  
  // Sync actions
  setAddress: (address) => set({ address }),
  setBalance: (balance) => set({ balance }),
  setEthBalance: (ethBalance) => set({ ethBalance }),
  setConnecting: (connecting) => set({ connecting }),
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),
  
  updateTransaction: (id, updates) => set((state) => ({
    transactions: state.transactions.map(tx => 
      tx.id === id ? { ...tx, ...updates } : tx
    )
  })),
  
  // State management
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Async actions - basic implementations
  fetchBalance: async () => {
    console.log('Fetching balance...');
  },
  
  fetchTransactions: async () => {
    console.log('Fetching transactions...');
  },
  
  depositFunds: async (amount, txHash) => {
    console.log('Depositing funds:', amount, txHash);
  },
  
  withdrawFunds: async (amount, address) => {
    console.log('Withdrawing funds:', amount, address);
  },
  
  // Legacy methods for compatibility
  loadTransactions: async () => {
    await get().fetchTransactions();
  },
  
  verifyTransactionHash: async (txHash) => {
    console.log('Verifying transaction hash:', txHash);
  }
}));

// Re-export types for convenience
export * from './types';
