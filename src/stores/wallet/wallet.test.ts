import { useWalletStore } from './index';

describe('Wallet Store', () => {
  beforeEach(() => {
    useWalletStore.setState({
      address: null,
      balance: 0,
      ethBalance: null,
      connecting: false,
      transactions: [],
      loading: false,
      error: null,
      pendingDeposit: false,
      pendingWithdrawal: false,
    });
  });

  it('should initialize with default state', () => {
    const state = useWalletStore.getState();
    expect(state.address).toBeNull();
    expect(state.balance).toBe(0);
    expect(state.connecting).toBe(false);
    expect(state.transactions).toEqual([]);
  });

  it('should update address', () => {
    const testAddress = '0x123...';
    useWalletStore.getState().setAddress(testAddress);
    expect(useWalletStore.getState().address).toBe(testAddress);
  });

  it('should update balance', () => {
    const testBalance = 100.5;
    useWalletStore.getState().setBalance(testBalance);
    expect(useWalletStore.getState().balance).toBe(testBalance);
  });

  it('should handle connecting state', () => {
    useWalletStore.getState().setConnecting(true);
    expect(useWalletStore.getState().connecting).toBe(true);
  });

  it('should add transaction', () => {
    const mockTransaction = {
      id: 'test-id',
      user_id: 'user-123',
      amount: 50,
      type: 'deposit' as const,
      status: 'confirmed' as const,
      created_at: new Date().toISOString(),
    };
    
    useWalletStore.getState().addTransaction(mockTransaction);
    expect(useWalletStore.getState().transactions).toHaveLength(1);
    expect(useWalletStore.getState().transactions[0]).toEqual(mockTransaction);
  });

  it('should update transaction', () => {
    const mockTransaction = {
      id: 'test-id',
      user_id: 'user-123',
      amount: 50,
      type: 'deposit' as const,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    };
    
    useWalletStore.getState().addTransaction(mockTransaction);
    useWalletStore.getState().updateTransaction('test-id', { status: 'confirmed' });
    
    const updatedTransaction = useWalletStore.getState().transactions[0];
    expect(updatedTransaction.status).toBe('confirmed');
  });
});
