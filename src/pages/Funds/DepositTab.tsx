
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { requestDeposit } from "@/lib/api/wallet";

const DepositTab: React.FC = () => {
  const [amount, setAmount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qrData, setQrData] = useState<{address: string; memo: string} | null>(null);
  const { toast } = useToast();

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

      <button
        className="bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-primary/90 transition mb-6"
        onClick={handleRequestDeposit}
        disabled={isLoading}
      >
        {isLoading ? "Generando..." : "Generar QR de depósito"}
      </button>

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
              <div className="p-2 bg-muted rounded mb-2 break-all">
                <p className="font-mono text-sm select-all">{qrData.address}</p>
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
