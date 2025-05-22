
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { requestDeposit } from "@/lib/api/wallet";
import { Button } from "@/components/ui/button";
import { Loader2, QrCode, Copy, Check, AlertCircle } from "lucide-react";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { useWalletStore } from "@/stores/wallet";

const DepositTab: React.FC = () => {
  const [amount, setAmount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qrData, setQrData] = useState<{address: string; memo: string} | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();
  const { address: walletAddress } = useWalletStore();

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0]);
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

  const handleCopyAddress = () => {
    if (!qrData) return;
    
    navigator.clipboard.writeText(qrData.address);
    setCopied(true);
    toast({
      title: "Dirección copiada",
      description: "La dirección ha sido copiada al portapapeles",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  // If no wallet is connected, show connect wallet prompt
  if (!walletAddress) {
    return (
      <div className="mt-6 bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Depositar fondos</h2>
        
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
      </div>
    );
  }

  return (
    <div className="mt-6 bg-card p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Depositar fondos</h2>
      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium">Cantidad a depositar (USDT)</label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Slider
              defaultValue={[10]}
              min={5}
              max={1000}
              step={5}
              value={[amount]}
              onValueChange={handleAmountChange}
            />
          </div>
          <div className="w-24">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border rounded p-2"
              min={5}
            />
          </div>
        </div>
      </div>

      <Button
        className="w-full sm:w-auto"
        onClick={handleRequestDeposit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <QrCode className="h-4 w-4 mr-2" />
            Generar QR de depósito
          </>
        )}
      </Button>

      {qrData && (
        <div className="mt-6 border p-4 rounded-lg bg-muted/40">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-white p-4 rounded-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData.address}`}
                alt="QR Code"
                className="w-[200px] h-[200px]"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Instrucciones</h3>
              <p className="mb-2">Envía exactamente <span className="font-bold">{amount} USDT</span> a la siguiente dirección:</p>
              <div className="flex items-center gap-2 p-2 bg-muted rounded mb-2 break-all">
                <p className="font-mono text-sm flex-1">{qrData.address}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopyAddress}
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {qrData.memo && (
                <>
                  <p className="mb-2">Con el siguiente memo (obligatorio):</p>
                  <div className="p-2 bg-muted rounded break-all">
                    <p className="font-mono text-sm select-all">{qrData.memo}</p>
                  </div>
                </>
              )}
              <p className="mt-4 text-sm text-muted-foreground">
                El depósito puede tardar hasta 30 minutos en acreditarse. Los depósitos sin memo o con cantidad incorrecta pueden perderse.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositTab;
