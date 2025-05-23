
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useWalletStore } from './index';

// Setup fetch mock
global.fetch = vi.fn();

describe('Wallet Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset the store
    act(() => {
      useWalletStore.setState({
        address: null,
        balance: 0,
        ethBalance: null,
        connecting: false,
        transactions: [],
        
        // Include actions required by TypeScript
        setAddress: () => {},
        setBalance: () => {},
        setEthBalance: () => {},
        setConnecting: () => {},
        addTransaction: () => {},
        updateTransaction: () => {},
        loadTransactions: async () => {},
        depositFunds: async () => null,
        withdrawFunds: async () => null,
        verifyTransactionHash: async () => false,
      });
    });
  });

  it('should update address correctly', () => {
    act(() => {
      useWalletStore.getState().setAddress('0x123');
    });
    
    expect(useWalletStore.getState().address).toBe('0x123');
  });

  it('should update balance correctly', () => {
    act(() => {
      useWalletStore.getState().setBalance(100.5);
    });
    
    expect(useWalletStore.getState().balance).toBe(100.5);
  });

  it('should add transactions correctly', () => {
    const transaction = {
      id: '1',
      hash: '0xabc',
      amount: 10,
      type: 'deposit' as const,
      status: 'confirmed' as const,
      timestamp: new Date(),
    };
    
    act(() => {
      useWalletStore.getState().addTransaction(transaction);
    });
    
    expect(useWalletStore.getState().transactions).toHaveLength(1);
    expect(useWalletStore.getState().transactions[0]).toEqual(transaction);
  });

  it('should update transaction status correctly', () => {
    const transaction = {
      id: '1',
      hash: '0xabc',
      amount: 10,
      type: 'deposit' as const,
      status: 'pending' as const,
      timestamp: new Date(),
    };
    
    act(() => {
      useWalletStore.getState().addTransaction(transaction);
      useWalletStore.getState().updateTransaction('1', 'confirmed');
    });
    
    expect(useWalletStore.getState().transactions[0].status).toBe('confirmed');
  });
});
