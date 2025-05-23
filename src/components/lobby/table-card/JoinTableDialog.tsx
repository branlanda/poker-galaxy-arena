
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useTranslation } from '@/hooks/useTranslation';
import { LobbyTable } from '@/types/lobby';
import { useJoinTable } from '@/hooks/useJoinTable';
import { motion } from 'framer-motion';
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
  const [isJoining, setIsJoining] = useState(false);
  const [password, setPassword] = useState('');
  const { joinTable, loading } = useJoinTable();
  const { t } = useTranslation();
  
  const handleJoin = async () => {
    const success = await joinTable(table, password);
    if (!success) {
      setIsJoining(false);
    }
  };

  const isFull = table.current_players >= table.max_players;

  return (
    <Dialog open={isJoining} onOpenChange={setIsJoining}>
      <DialogTrigger asChild>
        <Button 
          className="w-full relative overflow-hidden group" 
          disabled={isFull}
          variant={isFull ? "outline" : "primary"}
        >
          <motion.div 
            className="absolute inset-0 bg-emerald-500/20" 
            initial={false}
            animate={{ x: isFull ? '0%' : '100%' }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{ display: isFull ? 'none' : 'block' }}
          />
          <motion.span 
            className="relative z-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
          >
            {isFull ? t('tableFull', 'Mesa Llena') : t('joinTable', 'Unirse a la Mesa')}
          </motion.span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('joinTableName', 'Unirse a la Mesa')}: {table.name}</DialogTitle>
          <DialogDescription>
            {t('enterBuyIn', 'Ingresa tu cantidad de buy-in para unirte a esta mesa.')}
          </DialogDescription>
        </DialogHeader>
        <motion.div 
          className="space-y-4 py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('buyInAmount', 'Cantidad de Buy-in')} ({table.min_buy_in} - {table.max_buy_in})
            </label>
            <div className="relative">
              <Input
                type="number"
                defaultValue={table.min_buy_in}
                min={table.min_buy_in}
                max={table.max_buy_in}
                className="pl-6"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
            </div>
          </div>
          
          {table.is_private && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-sm font-medium">
                {t('password', 'Contraseña')}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('enterTablePassword', 'Ingresa la contraseña de la mesa')}
              />
            </motion.div>
          )}
        </motion.div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsJoining(false)}>
            {t('cancel', 'Cancelar')}
          </Button>
          <Button 
            onClick={handleJoin} 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                {t('joining', 'Uniéndose...')}
              </div>
            ) : (
              t('joinNow', 'Unirse Ahora')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
