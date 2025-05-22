
import { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from './use-toast';
import { verifyTransaction } from '@/lib/api/wallet';

export function useTransactionVerification() {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const { toast } = useToast();

  /**
   * Verify a transaction on the blockchain
   * @param txHash The transaction hash to verify
   * @returns Boolean indicating if verification was successful
   */
  const verifyBlockchainTx = async (txHash: string): Promise<boolean> => {
    try {
      setIsVerifying(true);
      
      // First, verify on our backend
      const apiVerification = await verifyTransaction(txHash);
      
      if (!apiVerification.success) {
        throw new Error(apiVerification.message || 'Transaction verification failed');
      }
      
      // Additionally verify on-chain if we have a provider
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const receipt = await provider.getTransactionReceipt(txHash);
        
        if (!receipt || !receipt.blockNumber) {
          throw new Error('Transaction not found or pending');
        }
        
        // Check if transaction was successful
        if (receipt.status === 0) {
          throw new Error('Transaction reverted on blockchain');
        }
        
        // Get confirmations
        const currentBlock = await provider.getBlockNumber();
        const confirmations = currentBlock - receipt.blockNumber;
        
        if (confirmations < 1) {
          toast({
            title: "Transaction pending",
            description: "Your transaction has been submitted but not yet confirmed",
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
