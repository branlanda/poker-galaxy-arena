
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useWalletStore } from './wallet';
import { supabase } from '@/integrations/supabase/client';

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

  it('should load transactions from Supabase', async () => {
    // Mock Supabase response
    (supabase.from as any).mockImplementation(() => ({
      select: () => ({
        order: () => Promise.resolve({
          data: [
            {
              id: '1',
              tx_hash: '0xabc',
              amount: 10,
              tx_type: 'DEPOSIT',
              meta: { status: 'confirmed' },
              created_at: '2023-01-01',
            },
            {
              id: '2',
              tx_hash: '0xdef',
              amount: 5,
              tx_type: 'WITHDRAW',
              meta: { status: 'pending' },
              created_at: '2023-01-02',
            },
          ],
        }),
      }),
    }));
    
    await act(async () => {
      await useWalletStore.getState().loadTransactions();
    });
    
    expect(useWalletStore.getState().transactions).toHaveLength(2);
    expect(useWalletStore.getState().transactions[0].type).toBe('deposit');
    expect(useWalletStore.getState().transactions[1].type).toBe('withdraw');
  });

  it('should handle deposit funds correctly', async () => {
    // Mock fetch response
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });
    
    await act(async () => {
      await useWalletStore.getState().depositFunds(50);
    });
    
    expect(useWalletStore.getState().transactions).toHaveLength(1);
    expect(useWalletStore.getState().transactions[0].amount).toBe(50);
    expect(useWalletStore.getState().transactions[0].type).toBe('deposit');
    expect(useWalletStore.getState().balance).toBe(50);
  });

  it('should handle withdraw funds correctly', async () => {
    // Set initial balance
    act(() => {
      useWalletStore.getState().setBalance(100);
    });
    
    // Mock fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    
    await act(async () => {
      await useWalletStore.getState().withdrawFunds('0x123', 30);
    });
    
    expect(useWalletStore.getState().transactions).toHaveLength(1);
    expect(useWalletStore.getState().transactions[0].amount).toBe(30);
    expect(useWalletStore.getState().transactions[0].type).toBe('withdraw');
    expect(useWalletStore.getState().balance).toBe(70);
  });
});
