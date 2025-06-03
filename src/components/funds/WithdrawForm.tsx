
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useBalance } from "@/hooks/useBalance";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface WithdrawFormProps {
  onWithdrawRequest: (address: string, amount: number) => void;
  isLoading: boolean;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onWithdrawRequest, isLoading }) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(10);
  const { toast } = useToast();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance();

  const maxWithdraw = balanceData?.amount || 0;

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const validateTronAddress = (address: string): boolean => {
    // Basic TRON address validation (starts with T and is 34 chars long)
    return /^T[A-Za-z0-9]{33}$/.test(address);
  };

  const handleSubmit = () => {
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

    onWithdrawRequest(address, amount);
  };

  return (
    <>
      <div className="mb-6">
        <label htmlFor="address" className="block mb-2 text-sm font-medium text-white">Dirección TRON (TRC20)</label>
        <input
          id="address"
          type="text"
          placeholder="Comienza con T..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-emerald/20 rounded p-2 bg-transparent text-white placeholder-gray-300"
        />
        <p className="text-sm text-gray-300 mt-1">
          Solo se aceptan direcciones TRON (TRC20)
        </p>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-white">
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
              className="w-full border border-emerald/20 rounded p-2 bg-transparent text-white placeholder-gray-300"
              min={10}
              max={maxWithdraw}
              disabled={maxWithdraw < 10 || isBalanceLoading}
            />
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-slate-800/30 rounded text-sm border border-emerald/20">
        <p className="font-medium mb-1 text-white">Información importante:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          <li>El retiro mínimo es de 10 USDT</li>
          <li>Los retiros se procesan en un plazo de 24 horas</li>
          <li>Comisión por retiro: 1 USDT</li>
        </ul>
      </div>
      
      <Button
        className="w-full sm:w-auto bg-emerald hover:bg-emerald/90 text-white"
        onClick={handleSubmit}
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
    </>
  );
};

export default WithdrawForm;
