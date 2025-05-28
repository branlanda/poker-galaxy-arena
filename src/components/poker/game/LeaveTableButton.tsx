
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LogOut, AlertTriangle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaveTableButtonProps {
  onLeaveTable: () => void;
  isPlayerTurn: boolean;
  playerStack?: number;
  gamePhase?: string;
  isInHand?: boolean;
  className?: string;
}

export const LeaveTableButton: React.FC<LeaveTableButtonProps> = ({
  onLeaveTable,
  isPlayerTurn,
  playerStack = 0,
  gamePhase,
  isInHand = false,
  className = ""
}) => {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeaveTable = async () => {
    setIsLeaving(true);
    try {
      await onLeaveTable();
    } finally {
      setIsLeaving(false);
    }
  };

  const getWarningMessage = () => {
    if (isPlayerTurn) {
      return "Estás en tu turno. Si te vas ahora, se considerará como fold automático.";
    }
    if (isInHand && gamePhase !== 'WAITING') {
      return "Estás en una mano activa. Si te vas, perderás cualquier apuesta realizada.";
    }
    return "¿Estás seguro de que quieres abandonar la mesa?";
  };

  const canLeaveImmediately = !isPlayerTurn && (!isInHand || gamePhase === 'WAITING');

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={className}
        >
          <Button
            variant="outline"
            size="sm"
            disabled={isLeaving}
            className="bg-red-600/10 border-red-400/30 text-red-400 hover:bg-red-600/20 hover:text-red-300 hover:border-red-400/50 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLeaving ? 'Saliendo...' : 'Salir de Mesa'}
          </Button>
        </motion.div>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="bg-slate-800 border-slate-600 text-white max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Abandonar Mesa
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300 space-y-3">
            <p>{getWarningMessage()}</p>
            
            {playerStack > 0 && (
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <div className="flex items-center gap-2 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">Stack actual: ${playerStack.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Tu stack será convertido a chips y agregado a tu balance.
                </p>
              </div>
            )}
            
            {!canLeaveImmediately && (
              <div className="bg-amber-600/10 border border-amber-400/30 rounded-lg p-3">
                <p className="text-amber-400 text-sm font-medium">
                  ⚠️ Salir ahora puede afectar tu reputación en el juego
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeaveTable}
            disabled={isLeaving}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLeaving ? 'Procesando...' : 'Confirmar Salida'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
