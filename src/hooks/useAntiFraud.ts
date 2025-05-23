
import { useState } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface FraudCheckResult {
  safe: boolean;
  reason?: string;
  riskScore?: number;
}

export function useAntiFraud() {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const { address } = useWalletStore();
  const { toast } = useToast();

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
        reason: `Transaction amount too small. Minimum is ${MIN_TRANSACTION} USDT.`,
        riskScore: 0.3
      };
    }
    
    if (amount > MAX_DEPOSIT && amount > MAX_WITHDRAWAL) {
      return { 
        safe: false, 
        reason: `Transaction amount exceeds maximum limits.`,
        riskScore: 0.8
      };
    }
    
    // Calculate risk score based on amount
    let riskScore = 0.1;
    if (amount > 1000) riskScore = 0.4;
    if (amount > 2000) riskScore = 0.6;
    
    return { safe: true, riskScore };
  };

  /**
   * Log suspicious activity to the database for admin review
   */
  const logSuspiciousActivity = async (
    userId: string | undefined,
    activityType: string,
    details: Record<string, any>,
    riskScore: number
  ) => {
    if (!userId) return;
    
    try {
      // Add to the telemetry or suspicious activity table
      await supabase
        .from('telemetry_raw')
        .insert({
          player_id: userId,
          payload: {
            activity_type: activityType,
            risk_score: riskScore,
            details,
            timestamp: new Date().toISOString()
          }
        });
      
      // For high-risk activities, send notification to admin
      if (riskScore > 0.7) {
        toast({
          title: "Security Alert",
          description: `High-risk activity detected: ${activityType}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to log suspicious activity:", error);
    }
  };

  /**
   * Verify wallet address against known fraud databases
   * This would connect to external APIs in a production environment
   */
  const checkWalletReputation = async (walletAddress: string): Promise<FraudCheckResult> => {
    // Mock implementation - in production this would call APIs
    // like Chainalysis, TRM Labs, Elliptic, or CipherTrace
    
    // For demonstration purposes, flag some addresses as suspicious
    const knownSuspiciousAddresses = [
      '0x000000000000000000000000000000000000dEaD',
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Vitalik's address for example
    ];
    
    if (knownSuspiciousAddresses.includes(walletAddress)) {
      return {
        safe: false,
        reason: 'Wallet address found in suspicious address database',
        riskScore: 0.9
      };
    }
    
    return { safe: true, riskScore: 0.1 };
  };

  /**
   * Check for suspicious activity patterns
   */
  const checkForSuspiciousActivity = async (
    txType: 'deposit' | 'withdraw',
    amount: number,
    userId?: string
  ): Promise<FraudCheckResult> => {
    try {
      setIsChecking(true);
      
      // Check transaction limits
      const limitsCheck = checkTransactionLimits(amount);
      if (!limitsCheck.safe) {
        if (userId) {
          await logSuspiciousActivity(
            userId, 
            'TRANSACTION_LIMIT_EXCEEDED',
            { txType, amount, limit_type: amount < 1 ? 'minimum' : 'maximum' },
            limitsCheck.riskScore || 0.7
          );
        }
        return limitsCheck;
      }
      
      // Get recent transactions to check for unusual patterns
      const { transactions } = useWalletStore.getState();
      const lastHourTransactions = transactions.filter(tx => 
        new Date().getTime() - new Date(tx.timestamp).getTime() < 60 * 60 * 1000
      );
      
      // Check for rapid succession of transactions (potential attack)
      if (lastHourTransactions.length >= 10) {
        if (userId) {
          await logSuspiciousActivity(
            userId,
            'RAPID_TRANSACTIONS',
            { txType, amount, count: lastHourTransactions.length },
            0.8
          );
        }
        
        return {
          safe: false,
          reason: 'Too many transactions in a short period. Please try again later.',
          riskScore: 0.8
        };
      }
      
      // For withdrawals, check if address has sufficient history
      if (txType === 'withdraw' && address) {
        // Check wallet reputation
        const reputationCheck = await checkWalletReputation(address);
        if (!reputationCheck.safe) {
          if (userId) {
            await logSuspiciousActivity(
              userId,
              'SUSPICIOUS_WALLET',
              { txType, amount, wallet: address },
              reputationCheck.riskScore || 0.8
            );
          }
          return reputationCheck;
        }
        
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const txCount = await provider.getTransactionCount(address);
          
          // New addresses with no history attempting large withdrawals is suspicious
          if (txCount < 5 && amount > 1000) {
            if (userId) {
              await logSuspiciousActivity(
                userId,
                'NEW_WALLET_LARGE_WITHDRAWAL',
                { txType, amount, wallet: address, txCount },
                0.75
              );
            }
            
            return {
              safe: false,
              reason: 'New wallet attempting large withdrawal. Please contact support.',
              riskScore: 0.75
            };
          }
        }
      }
      
      // Check for deposit/withdrawal pattern (money laundering pattern)
      const hasRecentOppositeTransaction = lastHourTransactions.some(tx => {
        const isOppositeType = (txType === 'deposit' && tx.type === 'withdraw') || 
                              (txType === 'withdraw' && tx.type === 'deposit');
        const isSignificantAmount = tx.amount > amount * 0.8; // 80% or more of current amount
        return isOppositeType && isSignificantAmount;
      });
      
      if (hasRecentOppositeTransaction) {
        if (userId) {
          await logSuspiciousActivity(
            userId,
            'POSSIBLE_LAUNDERING_PATTERN',
            { txType, amount, recent_transactions: lastHourTransactions.length },
            0.65
          );
        }
        // We'll allow it but with a warning
        toast({
          title: "Transaction Monitoring",
          description: "Unusual transaction pattern detected. This will be reviewed.",
          variant: "warning",
        });
      }
      
      return { safe: true, riskScore: hasRecentOppositeTransaction ? 0.65 : 0.2 };
    } catch (error) {
      console.error("Fraud check error:", error);
      return { safe: true, riskScore: 0.5 }; // Default to allowing the tx if checks fail
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkForSuspiciousActivity,
    logSuspiciousActivity,
    checkWalletReputation,
    isChecking
  };
}
