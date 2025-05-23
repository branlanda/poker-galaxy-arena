
import React from 'react';
import { useWalletStore } from '@/stores/wallet';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { Loader2, Wallet, LogOut } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { address, setAddress, setEthBalance, setConnecting, connecting } = useWalletStore();
  const { toast } = useToast();

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "No Wallet Found",
        description: "Please install MetaMask or another Web3 wallet to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      setConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      const selectedAccount = accounts[0];
      
      // Get ETH balance
      const balance = await provider.getBalance(selectedAccount);
      
      // Update state
      setAddress(selectedAccount);
      setEthBalance(ethers.formatEther(balance));
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${selectedAccount.substring(0, 6)}...${selectedAccount.substring(38)}`,
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setEthBalance(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  if (address) {
    return (
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="px-4 py-2 bg-muted rounded-lg flex items-center gap-2 text-sm">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono">
            {address.substring(0, 6)}...{address.substring(38)}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={disconnectWallet}>
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connectWallet} disabled={connecting}>
      {connecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wallet className="h-4 w-4 mr-2" />}
      Connect Wallet
    </Button>
  );
};
