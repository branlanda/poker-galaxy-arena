
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { getLedger } from '@/lib/api/wallet';
import { useBalance } from '@/hooks/useBalance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DepositTab from './DepositTab';
import WithdrawTab from './WithdrawTab';
import LedgerTable from './LedgerTable';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Shield } from "lucide-react";
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { useWalletStore } from '@/stores/wallet';
import PaymentIntegration from '@/components/payments/PaymentIntegration';
import KycVerification from '@/components/kyc/KycVerification';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import { AppLayout } from '@/components/layout/AppLayout';

const FundsPage = () => {
  const { data: balance, isLoading: isBalanceLoading, error: balanceError } = useBalance();
  const { data: ledger, isLoading: isLedgerLoading, error: ledgerError } = useQuery({
    queryKey: ['ledger'],
    queryFn: getLedger
  });
  const { ethBalance } = useWalletStore();

  const { toast } = useToast();

  // Show error messages with toast if needed
  React.useEffect(() => {
    if (balanceError) {
      toast({
        title: "Error",
        description: "No se pudo cargar el saldo",
        variant: "destructive",
      });
    }
    
    if (ledgerError) {
      toast({
        title: "Error",
        description: "No se pudo cargar el historial de transacciones",
        variant: "destructive",
      });
    }
  }, [balanceError, ledgerError, toast]);

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Mi Billetera</h1>
        <div className="mt-4 sm:mt-0">
          <WalletConnect />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 col-span-2">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">SALDO DISPONIBLE</h2>
          <div className="text-3xl font-bold">
            {isBalanceLoading ? (
              <div className="h-8 w-36 bg-muted animate-pulse rounded"></div>
            ) : (
              <span>{balance?.amount.toFixed(2)} USDT</span>
            )}
          </div>
          
          {ethBalance && (
            <div className="mt-2 text-sm text-muted-foreground">
              <span>ETH en wallet: {parseFloat(ethBalance).toFixed(4)} ETH</span>
            </div>
          )}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">INFORMACIÓN</h2>
          <Alert variant="default" className="bg-muted/50 border-none p-3">
            <Info className="w-4 h-4" />
            <AlertDescription>
              Sistema de pagos real integrado con Stripe y CoinPal para máxima seguridad
            </AlertDescription>
          </Alert>
        </Card>
      </div>
      
      <Tabs defaultValue="payments" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="deposit">Depositar</TabsTrigger>
          <TabsTrigger value="withdraw">Retirar</TabsTrigger>
          <TabsTrigger value="kyc">Verificación KYC</TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Seguridad
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments">
          <PaymentIntegration />
        </TabsContent>
        
        <TabsContent value="deposit">
          <DepositTab />
        </TabsContent>
        
        <TabsContent value="withdraw">
          <WithdrawTab />
        </TabsContent>
        
        <TabsContent value="kyc">
          <KycVerification />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityDashboard />
        </TabsContent>
      </Tabs>
      
      {isLedgerLoading ? (
        <div className="h-32 w-full bg-muted/20 animate-pulse rounded mb-8"></div>
      ) : (
        <LedgerTable entries={ledger || []} />
      )}
    </AppLayout>
  );
};

export default FundsPage;
