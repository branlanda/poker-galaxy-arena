
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
  address: string | null;
  balance: number;
  ethBalance: string | null;
  connecting: boolean;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  pendingDeposit: boolean;
  pendingWithdrawal: boolean;
}

export interface WalletActions {
  // Address and connection management
  setAddress: (address: string | null) => void;
  setBalance: (balance: number) => void;
  setEthBalance: (ethBalance: string | null) => void;
  setConnecting: (connecting: boolean) => void;
  
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
  
  // Legacy methods for compatibility
  loadTransactions: () => Promise<void>;
  verifyTransactionHash: (txHash: string) => Promise<void>;
}

export type WalletStore = WalletState & WalletActions;
