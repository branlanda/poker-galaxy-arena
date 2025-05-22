
import React, { ReactNode, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const { setAddress, setEthBalance, setConnecting, address } = useWalletStore();
  const { toast } = useToast();

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && address) {
        try {
          // Check if we're still authorized with this address
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0 && accounts[0] === address) {
            // Update balance
            updateBalance(address);
          } else {
            // Clear stored address if no longer connected
            setAddress(null);
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
          setAddress(null);
        }
      }
    };

    checkConnection();

    // Setup event listeners for wallet changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
      window.ethereum.on('disconnect', () => {
        setAddress(null);
        setEthBalance(null);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [address]);

  // Handle account changes
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected wallet
      setAddress(null);
      setEthBalance(null);
      toast({
        title: "Wallet disconnected",
        description: "Your crypto wallet has been disconnected",
      });
    } else if (accounts[0] !== address) {
      // User switched account
      setAddress(accounts[0]);
      updateBalance(accounts[0]);
      toast({
        title: "Wallet account changed",
        description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
      });
    }
  };

  // Update ETH balance
  const updateBalance = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setEthBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Failed to get balance:", error);
    }
  };

  return <>{children}</>;
}

// Add type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
