import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface WalletState {
  balance: number;
  setBalance: (balance: number) => void;
  fetchBalance: (userId: string) => Promise<void>;
  deposit: (userId: string, amount: number) => Promise<void>;
  withdraw: (userId: string, amount: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  setBalance: (balance) => set({ balance }),
  fetchBalance: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching balance:', error);
        return;
      }

      set({ balance: data?.wallet_balance || 0 });
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  },
  deposit: async (userId, amount) => {
    try {
      const { data, error } = await supabase.rpc('deposit', {
        user_id: userId,
        amount: amount,
      });

      if (error) {
        console.error('Error depositing funds:', error);
        throw error;
      }

      // Optimistically update the balance
      set((state) => ({ balance: state.balance + amount }));
    } catch (error) {
      console.error('Error in deposit action:', error);
      throw error;
    }
  },
  withdraw: async (userId, amount) => {
    try {
      const { data, error } = await supabase.rpc('withdraw', {
        user_id: userId,
        amount: amount,
      });

      if (error) {
        console.error('Error withdrawing funds:', error);
        throw error;
      }

      // Optimistically update the balance
      set((state) => ({ balance: state.balance - amount }));
    } catch (error) {
      console.error('Error in withdraw action:', error);
      throw error;
    }
  },
}));
