
import React from 'react';
import { AlertCircle } from "lucide-react";
import { WalletConnect } from "@/components/wallet/WalletConnect";

const DepositConnectionPrompt: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Conecta tu wallet para continuar</h3>
      <p className="text-muted-foreground mb-6">
        Para depositar fondos a tu cuenta, primero debes conectar tu wallet Web3.
      </p>
      
      <div className="flex justify-center">
        <WalletConnect />
      </div>
    </div>
  );
};

export default DepositConnectionPrompt;
