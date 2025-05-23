
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

// Define actions interface
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
