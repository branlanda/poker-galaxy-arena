
import { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from './use-toast';
import { verifyTransaction } from '@/lib/api/wallet';
import { supabase } from '@/lib/supabase';
import { useAntiFraud } from './useAntiFraud';

export function useTransactionVerification() {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const { toast } = useToast();
  const { logSuspiciousActivity } = useAntiFraud();

  /**
   * Verify a transaction on the blockchain and log it to the database
   * @param txHash The transaction hash to verify
   * @param userId Optional user ID for logging
   * @returns Boolean indicating if verification was successful
   */
  const verifyBlockchainTx = async (
    txHash: string, 
    options: { 
      userId?: string, 
      expectedAmount?: number, 
      expectedToken?: string 
    } = {}
  ): Promise<boolean> => {
    try {
      setIsVerifying(true);
      
      // First, verify on our backend
      const apiVerification = await verifyTransaction(txHash);
      
      if (!apiVerification.success) {
        if (options.userId) {
          await logSuspiciousActivity(
            options.userId,
            'API_VERIFICATION_FAILED',
            { txHash, error: apiVerification.message },
            0.6
          );
        }
        throw new Error(apiVerification.message || 'Transaction verification failed');
      }
      
      // Additionally verify on-chain if we have a provider
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const receipt = await provider.getTransactionReceipt(txHash);
        
        if (!receipt || !receipt.blockNumber) {
          if (options.userId) {
            await logSuspiciousActivity(
              options.userId,
              'TRANSACTION_NOT_FOUND',
              { txHash },
              0.7
            );
          }
          throw new Error('Transaction not found or pending');
        }
        
        // Get transaction details to verify amount and token
        const tx = await provider.getTransaction(txHash);
        if (tx && options.expectedAmount) {
          // This is a simplified check. In production, we'd decode the transaction data
          // to verify the exact token transfer amount for ERC20 tokens
          const txValueInEth = ethers.formatEther(tx.value || 0);
          const expectedAmountStr = options.expectedAmount.toString();
          
          if (txValueInEth !== expectedAmountStr && !options.expectedToken) {
            if (options.userId) {
              await logSuspiciousActivity(
                options.userId,
                'AMOUNT_MISMATCH',
                { 
                  txHash, 
                  expectedAmount: options.expectedAmount,
                  actualAmount: txValueInEth 
                },
                0.8
              );
            }
            
            toast({
              title: "Amount verification failed",
              description: `Expected ${options.expectedAmount} but found ${txValueInEth}`,
              variant: "warning",
            });
          }
        }
        
        // Check if transaction was successful
        if (receipt.status === 0) {
          if (options.userId) {
            await logSuspiciousActivity(
              options.userId,
              'TRANSACTION_REVERTED',
              { txHash },
              0.8
            );
          }
          throw new Error('Transaction reverted on blockchain');
        }
        
        // Get confirmations
        const currentBlock = await provider.getBlockNumber();
        const confirmations = currentBlock - receipt.blockNumber;
        
        // Log the transaction in our database
        await supabase.from('ledger_entries').insert({
          tx_hash: txHash,
          meta: {
            confirmations,
            block_number: receipt.blockNumber,
            verified_at: new Date().toISOString(),
            gas_used: receipt.gasUsed?.toString(),
            user_id: options.userId
          }
        }).select();
        
        if (confirmations < 1) {
          toast({
            title: "Transaction pending",
            description: "Your transaction has been submitted but not yet confirmed",
          });
          return false;
        }
        
        // For important transactions, require more confirmations
        if (options.expectedAmount && options.expectedAmount > 1000 && confirmations < 3) {
          toast({
            title: "More confirmations needed",
            description: `For large amounts, please wait for more confirmations (${confirmations}/3)`,
          });
          return false;
        }
      }
      
      toast({
        title: "Transaction verified",
        description: "Your transaction has been successfully verified",
      });
      
      return true;
    } catch (error) {
      console.error("Transaction verification error:", error);
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Could not verify transaction",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    verifyBlockchainTx,
    isVerifying
  };
}
