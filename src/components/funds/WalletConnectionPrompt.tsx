
import React from 'react';
import { AlertCircle } from "lucide-react";
import { WalletConnect } from "@/components/wallet/WalletConnect";

const WalletConnectionPrompt: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4 border border-emerald/20">
        <AlertCircle className="h-8 w-8 text-emerald" />
      </div>
      <h3 className="text-lg font-medium mb-2 text-white">Conecta tu wallet para continuar</h3>
      <p className="text-gray-300 mb-6">
        Para retirar fondos de tu cuenta, primero debes conectar tu wallet Web3.
      </p>
      
      <div className="flex justify-center">
        <WalletConnect />
      </div>
    </div>
  );
};

export default WalletConnectionPrompt;
