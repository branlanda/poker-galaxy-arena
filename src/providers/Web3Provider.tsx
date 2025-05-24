
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';

interface Web3ContextType {
  provider: BrowserProvider | null;
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signer: JsonRpcSigner | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const { setUser } = useAuth();

  useEffect(() => {
    // Check if metamask is already connected
    const checkExistingConnection = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new BrowserProvider(window.ethereum as any);
          const accounts = await web3Provider.listAccounts();

          if (accounts.length > 0) {
            const account = accounts[0].address;
            setProvider(web3Provider);
            setAccount(account);
            setSigner(await web3Provider.getSigner());
          }
        } catch (error) {
          console.error("Error checking existing connection:", error);
        }
      }
    };

    checkExistingConnection();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Provider = new BrowserProvider(window.ethereum as any);
        const accounts = await web3Provider.listAccounts();
        const account = accounts[0].address;

        setProvider(web3Provider);
        setAccount(account);
        setSigner(await web3Provider.getSigner());

        // Fetch or create user profile in Supabase
        const { data: existingUser, error: selectError } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', account)
          .single();

        if (selectError && selectError.code !== 'PGRST116') {
          throw selectError; // Real error
        }

        if (!existingUser) {
          // Generate a random alias
          const randomAlias = `user_${Math.random().toString(36).substring(7)}`;

          // Create a new profile
          const { data: newUser, error: insertError } = await supabase
            .from('profiles')
            .insert([{ wallet_address: account, alias: randomAlias }])
            .select('*')
            .single();

          if (insertError) throw insertError;

          // Optimistically update user state
          setUser({
            id: newUser.id,
            alias: newUser.alias,
            avatarUrl: newUser.avatar_url,
          });
        } else {
          // Optimistically update user state
          setUser({
            id: existingUser.id,
            alias: existingUser.alias,
            avatarUrl: existingUser.avatar_url,
          });
        }
      } catch (error: any) {
        console.error("Error connecting to Metamask:", error);
      }
    } else {
      console.log("Metamask not detected");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setAccount(null);
    setSigner(null);
  };

  const value: Web3ContextType = {
    provider,
    account,
    connectWallet,
    disconnectWallet,
    signer,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
