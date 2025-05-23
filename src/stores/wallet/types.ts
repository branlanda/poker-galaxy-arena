
// Wallet types
export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  hash?: string | null;
  created_at: string;
  completed_at?: string;
}

export interface WalletState {
  address: string | null;
  balance: number;
  ethBalance: string | null;
  connecting: boolean;
  transactions: Transaction[];
  
  setAddress: (address: string | null) => void;
  setBalance: (balance: number) => void;
  setEthBalance: (ethBalance: string | null) => void;
  setConnecting: (connecting: boolean) => void;
  
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, status: TransactionStatus) => void;
}

export interface WalletActions {
  loadTransactions: () => Promise<void>;
  depositFunds: (amount: number) => Promise<Transaction>;
  withdrawFunds: (address: string, amount: number) => Promise<Transaction>;
  verifyTransactionHash: (txHash: string) => Promise<any>;
}
