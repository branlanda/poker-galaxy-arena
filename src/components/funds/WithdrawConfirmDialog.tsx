
import React from 'react';
import { Loader2 } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface WithdrawConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  address: string;
  amount: number;
  isLoading: boolean;
}

const WithdrawConfirmDialog: React.FC<WithdrawConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  address,
  amount,
  isLoading
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-800 border-emerald/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Confirmar retiro</AlertDialogTitle>
          <AlertDialogDescription className="text-white">
            Estás a punto de retirar <strong>{amount} USDT</strong> a la dirección:
            <div className="p-2 bg-slate-700/50 rounded my-2 break-all border border-emerald/20">
              <code className="text-xs text-white">{address}</code>
            </div>
            <p className="mt-2 text-white">Esta acción no se puede revertir una vez procesada.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-white bg-transparent border-emerald/20 hover:bg-emerald/10">Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-emerald hover:bg-emerald/90 text-white"
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
  );
};

export default WithdrawConfirmDialog;
