
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
            onClick={onConfirm}
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
  );
};

export default WithdrawConfirmDialog;
