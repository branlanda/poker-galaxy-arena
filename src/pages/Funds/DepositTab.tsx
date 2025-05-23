
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { requestDeposit } from "@/lib/api/wallet";
import { useWalletStore } from '@/stores/wallet';
import DepositConnectionPrompt from "@/components/funds/DepositConnectionPrompt";
import DepositForm from "@/components/funds/DepositForm";
import DepositQRCode from "@/components/funds/DepositQRCode";

const DepositTab: React.FC = () => {
  const [amount, setAmount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qrData, setQrData] = useState<{address: string; memo: string} | null>(null);
  const { toast } = useToast();
  const { address: walletAddress } = useWalletStore();

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleRequestDeposit = async () => {
    if (amount < 5) {
      toast({
        title: "Error",
        description: "El monto mínimo de depósito es 5 USDT",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setQrData(null);
      toast({
        title: "Generando dirección de depósito",
        description: "Por favor espere...",
      });

      const data = await requestDeposit(amount);
      
      setQrData(data);
      toast({
        title: "Dirección generada",
        description: "Envíe exactamente la cantidad especificada a esta dirección",
      });
    } catch (error) {
      console.error("Error generating deposit address:", error);
      toast({
        title: "Error",
        description: "No se pudo generar la dirección de depósito. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-card p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Depositar fondos</h2>
      
      {!walletAddress ? (
        <DepositConnectionPrompt />
      ) : (
        <>
          <DepositForm 
            amount={amount}
            onAmountChange={handleAmountChange}
            onRequestDeposit={handleRequestDeposit}
            isLoading={isLoading}
          />
          
          {qrData && <DepositQRCode qrData={{ ...qrData, amount }} />}
        </>
      )}
    </div>
  );
};

export default DepositTab;
