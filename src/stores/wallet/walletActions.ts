
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { Transaction } from './types';

export const depositFunds = async (amount: number, txHash?: string) => {
  const { user } = useAuth.getState();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          amount,
          type: 'deposit',
          status: txHash ? 'confirmed' : 'pending',
          blockchain_tx_hash: txHash,
          description: `Deposit of ${amount} USDT`,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error depositing funds:', error);
    throw error;
  }
};

export const withdrawFunds = async (amount: number, address: string) => {
  const { user } = useAuth.getState();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          amount: -amount,
          type: 'withdrawal',
          status: 'pending',
          description: `Withdrawal of ${amount} USDT to ${address}`,
          metadata: { withdrawal_address: address },
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error withdrawing funds:', error);
    throw error;
  }
};
