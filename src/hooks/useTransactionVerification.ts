import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export const useTransactionVerification = () => {
  const [verifying, setVerifying] = useState(false);

  const verifyTransaction = async (transactionHash: string) => {
    setVerifying(true);
    try {
      // Call your Supabase function here
      const { data, error } = await supabase.functions.invoke('verify-transaction', {
        body: { transactionHash },
      });

      if (error) {
        console.error('Function call error:', error);
        return { success: false, message: error.message };
      }

      return data; // Or process the data as needed

    } catch (err: any) {
      console.error("Unexpected error:", err);
      return { success: false, message: err.message };
    } finally {
      setVerifying(false);
    }
  };

  return { verifyTransaction, verifying };
};

