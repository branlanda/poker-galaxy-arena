
import { useState } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { ethers } from 'ethers';

interface FraudCheckResult {
  safe: boolean;
  reason?: string;
}

export function useAntiFraud() {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const { address } = useWalletStore();

  /**
   * Check if the transaction amount is within reasonable limits
   */
  const checkTransactionLimits = (amount: number): FraudCheckResult => {
    // Set reasonable transaction limits
    const MIN_TRANSACTION = 1;
    const MAX_DEPOSIT = 5000; 
    const MAX_WITHDRAWAL = 5000;
    
    if (amount < MIN_TRANSACTION) {
      return { 
        safe: false, 
        reason: `Transaction amount too small. Minimum is ${MIN_TRANSACTION} USDT.`
      };
    }
    
    if (amount > MAX_DEPOSIT && amount > MAX_WITHDRAWAL) {
      return { 
        safe: false, 
        reason: `Transaction amount exceeds maximum limits.`
      };
    }
    
    return { safe: true };
  };

  /**
   * Check for suspicious activity patterns
   */
  const checkForSuspiciousActivity = async (
    txType: 'deposit' | 'withdraw',
    amount: number
  ): Promise<FraudCheckResult> => {
    try {
      setIsChecking(true);
      
      // Check transaction limits
      const limitsCheck = checkTransactionLimits(amount);
      if (!limitsCheck.safe) {
        return limitsCheck;
      }
      
      // Get recent transactions to check for unusual patterns
      const { transactions } = useWalletStore.getState();
      const lastHourTransactions = transactions.filter(tx => 
        new Date().getTime() - new Date(tx.timestamp).getTime() < 60 * 60 * 1000
      );
      
      // Check for rapid succession of transactions (potential attack)
      if (lastHourTransactions.length >= 10) {
        return {
          safe: false,
          reason: 'Too many transactions in a short period. Please try again later.'
        };
      }
      
      // For withdrawals, check if address has sufficient history
      if (txType === 'withdraw' && address) {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const txCount = await provider.getTransactionCount(address);
          
          // New addresses with no history attempting large withdrawals is suspicious
          if (txCount < 5 && amount > 1000) {
            return {
              safe: false,
              reason: 'New wallet attempting large withdrawal. Please contact support.'
            };
          }
        }
      }
      
      return { safe: true };
    } catch (error) {
      console.error("Fraud check error:", error);
      return { safe: true }; // Default to allowing the tx if checks fail
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkForSuspiciousActivity,
    isChecking
  };
}
