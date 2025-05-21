
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useBalance } from "@/hooks/useBalance";
import { Slider } from "@/components/ui/slider";
import { requestWithdraw } from "@/lib/api/wallet";

const WithdrawTab: React.FC = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: balanceData } = useBalance();

  const maxWithdraw = balanceData?.amount || 0;

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const validateTronAddress = (address: string): boolean => {
    // Basic TRON address validation (starts with T and is 34 chars long)
    return /^T[A-Za-z0-9]{33}$/.test(address);
  };

  const handleWithdraw = async () => {
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

    try {
      setIsLoading(true);
      toast({
        title: "Procesando solicitud",
        description: "Su solicitud está siendo procesada...",
      });

      const res = await requestWithdraw(address, amount);
      
      if (res.ok) {
        toast({
          title: "Solicitud enviada",
          description: "Su solicitud de retiro ha sido enviada correctamente",
        });
        
        // Reset form
        setAddress('');
        setAmount(10);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error desconocido");
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo procesar su solicitud",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          Cantidad a retirar (USDT) - Disponible: {maxWithdraw} USDT
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
              disabled={maxWithdraw < 10}
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
      
      <button
        className="bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-primary/90 transition"
        onClick={handleWithdraw}
        disabled={isLoading || maxWithdraw < 10}
      >
        {isLoading ? "Procesando..." : "Solicitar retiro"}
      </button>
    </div>
  );
};

export default WithdrawTab;
