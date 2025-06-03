
import React, { useState } from 'react';
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DepositQRCodeProps {
  qrData: {
    address: string;
    memo?: string;
    amount: number;
  };
}

const DepositQRCode: React.FC<DepositQRCodeProps> = ({ qrData }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

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

  return (
    <div className="mt-6 border border-emerald/20 p-4 rounded-lg bg-slate-800/30">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="bg-white p-4 rounded-lg">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData.address}`}
            alt="QR Code"
            className="w-[200px] h-[200px]"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2 text-white">Instrucciones</h3>
          <p className="mb-2 text-gray-300">Envía exactamente <span className="font-bold text-white">{qrData.amount} USDT</span> a la siguiente dirección:</p>
          <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded mb-2 break-all border border-emerald/20">
            <p className="font-mono text-sm flex-1 text-white">{qrData.address}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyAddress}
              className="flex-shrink-0 text-white hover:bg-emerald/20"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          {qrData.memo && (
            <>
              <p className="mb-2 text-gray-300">Con el siguiente memo (obligatorio):</p>
              <div className="p-2 bg-slate-700/50 rounded break-all border border-emerald/20">
                <p className="font-mono text-sm select-all text-white">{qrData.memo}</p>
              </div>
            </>
          )}
          <p className="mt-4 text-sm text-gray-300">
            El depósito puede tardar hasta 30 minutos en acreditarse. Los depósitos sin memo o con cantidad incorrecta pueden perderse.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepositQRCode;
