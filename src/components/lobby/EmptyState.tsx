
import { TableProperties } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/stores/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { CreateTableDialog } from './CreateTableDialog';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  onResetFilters: () => void;
}

export function EmptyState({ onResetFilters }: EmptyStateProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-navy/30 border border-emerald/10 rounded-lg py-12 text-center"
    >
      <div className="flex justify-center mb-4">
        <motion.div 
          className="p-4 rounded-full bg-emerald/10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <TableProperties className="h-10 w-10 text-emerald" />
        </motion.div>
      </div>
      <h3 className="text-xl font-medium text-gray-300">{t('noTablesFound', 'No se encontraron mesas')}</h3>
      <p className="text-gray-400 mt-2 max-w-md mx-auto">
        {user ? 
          t('noTablesMatch', 'Ninguna mesa coincide con tus filtros actuales. Ajusta tus filtros o crea una nueva mesa para comenzar a jugar.') : 
          t('logInToPlay', '¡Inicia sesión para crear tu propia mesa o unirte a una existente!')}
      </p>
      {user ? (
        <motion.div 
          className="mt-6 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="outline" onClick={onResetFilters}>
            {t('clearFilters', 'Limpiar Filtros')}
          </Button>
          <CreateTableDialog />
        </motion.div>
      ) : (
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button onClick={() => window.location.href = '/login'}>
            {t('logInToPlay', 'Iniciar Sesión para Jugar')}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
