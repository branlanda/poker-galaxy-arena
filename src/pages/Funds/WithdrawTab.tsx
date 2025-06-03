
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useWalletStore } from '@/stores/wallet';
import { requestWithdraw } from "@/lib/api/wallet";
import WalletConnectionPrompt from "@/components/funds/WalletConnectionPrompt";
import WithdrawForm from "@/components/funds/WithdrawForm";
import WithdrawConfirmDialog from "@/components/funds/WithdrawConfirmDialog";

const WithdrawTab: React.FC = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  const { address: walletAddress } = useWalletStore();

  const handleWithdrawRequest = (withdrawAddress: string, withdrawAmount: number) => {
    setAddress(withdrawAddress);
    setAmount(withdrawAmount);
    setShowConfirm(true);
  };

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "Procesando solicitud",
        description: "Su solicitud está siendo procesada...",
      });

      const data = await requestWithdraw(address, amount);
      
      toast({
        title: "Solicitud enviada",
        description: "Su solicitud de retiro ha sido enviada correctamente",
      });
      
      // Reset form
      setAddress('');
      setAmount(10);
    } catch (error) {
      console.error("Withdraw error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo procesar su solicitud",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };
  
  return (
    <>
      <div className="mt-6 bg-transparent border border-emerald/20 p-6 rounded-lg backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 text-white">Retirar fondos</h2>
        
        {!walletAddress ? (
          <WalletConnectionPrompt />
        ) : (
          <WithdrawForm 
            onWithdrawRequest={handleWithdrawRequest}
            isLoading={isLoading}
          />
        )}
      </div>

      <WithdrawConfirmDialog 
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleWithdraw}
        address={address}
        amount={amount}
        isLoading={isLoading}
      />
    </>
  );
};

export default WithdrawTab;
