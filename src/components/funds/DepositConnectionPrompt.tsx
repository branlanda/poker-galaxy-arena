
import React from 'react';
import { AlertCircle } from "lucide-react";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

const DepositConnectionPrompt: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-8 text-center rounded-lg border border-emerald/20 bg-slate-800/30">
      <div className="mx-auto w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4 border border-emerald/20">
        <AlertCircle className="h-8 w-8 text-emerald" />
      </div>
      <h3 className="text-lg font-medium mb-2 text-white">{t('funds.connectWallet', 'Conecta tu wallet para continuar')}</h3>
      <p className="text-gray-300 mb-6 max-w-md mx-auto">
        {t('funds.depositDescription', 'Para depositar fondos a tu cuenta, primero debes conectar tu wallet Web3.')}
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <WalletConnect />
        <Button variant="outline" className="border-emerald/20 text-white hover:bg-emerald/10 bg-transparent">
          <a href="/funds" className="inline-flex items-center">
            {t('funds.learnMore', 'Aprender más')}
          </a>
        </Button>
      </div>
      
      <p className="mt-6 text-xs text-gray-300">
        {t('funds.supportedWallets', 'Soportamos MetaMask, WalletConnect y más')}
      </p>
    </div>
  );
};

export default DepositConnectionPrompt;
