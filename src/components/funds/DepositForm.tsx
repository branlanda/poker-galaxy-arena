
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/Button";
import { Loader2, QrCode } from "lucide-react";

interface DepositFormProps {
  amount: number;
  onAmountChange: (value: number) => void;
  onRequestDeposit: () => void;
  isLoading: boolean;
}

const DepositForm: React.FC<DepositFormProps> = ({ 
  amount, 
  onAmountChange, 
  onRequestDeposit,
  isLoading 
}) => {
  const handleAmountChange = (value: number[]) => {
    onAmountChange(value[0]);
  };

  return (
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
            onChange={(e) => onAmountChange(Number(e.target.value))}
            className="w-full border rounded p-2"
            min={5}
          />
        </div>
      </div>

      <div className="mt-6">
        <Button
          className="w-full sm:w-auto"
          onClick={onRequestDeposit}
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
      </div>
    </div>
  );
};

export default DepositForm;
