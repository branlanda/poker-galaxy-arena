
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useBalance } from "@/hooks/useBalance";
import { Slider } from "@/components/ui/slider";
import { requestWithdraw } from "@/lib/api/wallet";
import { useWalletStore } from '@/stores/wallet';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, AlertCircle } from "lucide-react";
import { WalletConnect } from "@/components/wallet/WalletConnect";

const WithdrawTab: React.FC = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance();
  const { address: walletAddress } = useWalletStore();

  const maxWithdraw = balanceData?.amount || 0;

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const validateTronAddress = (address: string): boolean => {
    // Basic TRON address validation (starts with T and is 34 chars long)
    return /^T[A-Za-z0-9]{33}$/.test(address);
  };

  const handleWithdrawRequest = () => {
    // Validations
    if (!validateTronAddress(address)) {
      toast({
        title: "Dirección inválida",
        description: "Por favor ingrese una dirección TRON válida",
        variant: "destructive",
      });
      return;
    }

    if (amount < 10) {
      toast({
        title: "Monto inválido",
        description: "El monto mínimo de retiro es 10 USDT",
        variant: "destructive",
      });
      return;
    }

    if (amount > maxWithdraw) {
      toast({
        title: "Fondos insuficientes",
        description: `Su saldo disponible es ${maxWithdraw} USDT`,
        variant: "destructive",
      });
      return;
    }

    // Show confirmation dialog
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
  
  // If no wallet is connected, show connect wallet prompt
  if (!walletAddress) {
    return (
      <div className="mt-6 bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Retirar fondos</h2>
        
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Conecta tu wallet para continuar</h3>
          <p className="text-muted-foreground mb-6">
            Para retirar fondos de tu cuenta, primero debes conectar tu wallet Web3.
          </p>
          
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Retirar fondos</h2>
        
        <div className="mb-6">
          <label htmlFor="address" className="block mb-2 text-sm font-medium">Dirección TRON (TRC20)</label>
          <input
            id="address"
            type="text"
            placeholder="Comienza con T..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded p-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Solo se aceptan direcciones TRON (TRC20)
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">
            Cantidad a retirar (USDT) - Disponible: {isBalanceLoading ? "Cargando..." : `${maxWithdraw} USDT`}
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                defaultValue={[10]}
                min={10}
                max={Math.max(10, maxWithdraw)}
                step={5}
                value={[amount]}
                onValueChange={handleAmountChange}
                disabled={maxWithdraw < 10 || isBalanceLoading}
              />
            </div>
            <div className="w-24">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.min(Number(e.target.value), maxWithdraw))}
                className="w-full border rounded p-2"
                min={10}
                max={maxWithdraw}
                disabled={maxWithdraw < 10 || isBalanceLoading}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-muted/50 rounded text-sm">
          <p className="font-medium mb-1">Información importante:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>El retiro mínimo es de 10 USDT</li>
            <li>Los retiros se procesan en un plazo de 24 horas</li>
            <li>Comisión por retiro: 1 USDT</li>
          </ul>
        </div>
        
        <Button
          className="w-full sm:w-auto"
          onClick={handleWithdrawRequest}
          disabled={isLoading || maxWithdraw < 10 || isBalanceLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            "Solicitar retiro"
          )}
        </Button>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar retiro</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de retirar <strong>{amount} USDT</strong> a la dirección:
              <div className="p-2 bg-muted rounded my-2 break-all">
                <code className="text-xs">{address}</code>
              </div>
              <p className="mt-2">Esta acción no se puede revertir una vez procesada.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleWithdraw}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar retiro"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WithdrawTab;
