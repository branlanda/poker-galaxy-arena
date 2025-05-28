
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/hooks/useTranslation';
import { LobbyTable } from '@/types/lobby';
import { useJoinTable } from '@/hooks/useJoinTable';
import { useAuth } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, DollarSign, Lock, Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface JoinTableDialogProps {
  table: LobbyTable;
}

export function JoinTableDialog({ table }: JoinTableDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [buyInAmount, setBuyInAmount] = useState(table.min_buy_in);
  const [password, setPassword] = useState('');
  const { joinTable, loading } = useJoinTable();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleJoin = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const success = await joinTable(table, password);
    if (success) {
      setIsOpen(false);
    }
  };

  const handleDirectJoin = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Si es el creador, ir directamente
    if (user.id === table.creator_id) {
      navigate(`/game/${table.id}`);
      return;
    }

    // Si no es privada, intentar unirse directamente
    if (!table.is_private) {
      handleJoin();
    } else {
      setIsOpen(true);
    }
  };

  const isFull = table.current_players >= table.max_players;
  const isCreator = user?.id === table.creator_id;
  const canJoin = !isFull || isCreator;

  // Botón principal más intuitivo
  const getButtonText = () => {
    if (!user) return '🔐 Iniciar Sesión para Jugar';
    if (isCreator) return '🎮 Entrar a Mi Mesa';
    if (isFull) return '😔 Mesa Llena';
    if (table.is_private) return '🔒 Unirse con Contraseña';
    return '🚀 ¡Jugar Ahora!';
  };

  const getButtonVariant = () => {
    if (!canJoin && !isCreator) return "outline";
    if (isCreator) return "default";
    return "default";
  };

  return (
    <>
      <Button 
        className="w-full relative overflow-hidden group" 
        disabled={!canJoin && !isCreator}
        variant={getButtonVariant()}
        onClick={handleDirectJoin}
      >
        <motion.div 
          className="absolute inset-0 bg-emerald-500/20" 
          initial={false}
          animate={{ x: canJoin ? ['100%', '0%', '100%'] : '0%' }}
          transition={{ 
            repeat: canJoin ? Infinity : 0, 
            duration: 2, 
            ease: "linear" 
          }}
          style={{ display: canJoin ? 'block' : 'none' }}
        />
        <motion.span 
          className="relative z-10 flex items-center justify-center gap-2"
          animate={{ scale: canJoin ? [1, 1.02, 1] : 1 }}
          transition={{ repeat: canJoin ? Infinity : 0, duration: 2, repeatType: "reverse" }}
        >
          {getButtonText()}
        </motion.span>
      </Button>

      {/* Dialog solo para configuración avanzada */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-500" />
              Unirse a: {table.name}
            </DialogTitle>
            <DialogDescription>
              Configura tu entrada a la mesa
            </DialogDescription>
          </DialogHeader>
          
          <motion.div 
            className="space-y-6 py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Información de la mesa */}
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-gray-300">Jugadores</span>
                </div>
                <span className="text-sm font-medium">{table.current_players}/{table.max_players}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-gray-300">Ciegas</span>
                </div>
                <span className="text-sm font-medium">${table.small_blind}/${table.big_blind}</span>
              </div>
            </div>

            {/* Buy-in */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Cantidad de Fichas ({table.min_buy_in} - {table.max_buy_in})
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={buyInAmount}
                  onChange={(e) => setBuyInAmount(Number(e.target.value))}
                  min={table.min_buy_in}
                  max={table.max_buy_in}
                  className="pl-8"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              </div>
            </div>
            
            {/* Contraseña si es necesaria */}
            {table.is_private && (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.2 }}
              >
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Contraseña de la Mesa
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                />
              </motion.div>
            )}
          </motion.div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleJoin} 
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  ¡Entrar Ahora!
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
