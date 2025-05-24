
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'bet' | 'payout';
  status: 'pending' | 'confirmed' | 'failed';
  blockchain_tx_hash?: string;
  description?: string;
  metadata?: any;
  created_at: string;
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  pendingDeposit: boolean;
  pendingWithdrawal: boolean;
}

export interface WalletActions {
  // Balance management
  updateBalance: (newBalance: number) => void;
  
  // Transaction management
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  
  // Async actions
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  depositFunds: (amount: number, txHash?: string) => Promise<void>;
  withdrawFunds: (amount: number, address: string) => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type WalletStore = WalletState & WalletActions;
