
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Search, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  onResetFilters: () => void;
}

export function EmptyState({ onResetFilters }: EmptyStateProps) {
  const { t } = useTranslation();
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-10 border border-dashed border-emerald/20 rounded-lg bg-slate-800/30 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Search className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium mb-2 text-white">{t('lobby.noTablesFound')}</h3>
      <p className="text-gray-400 mb-6 max-w-md">
        {t('lobby.noTablesDescription')}
      </p>
      <Button onClick={onResetFilters} className="bg-emerald hover:bg-emerald/90 text-white">
        <RefreshCcw className="h-4 w-4 mr-2" />
        {t('lobby.resetFilters')}
      </Button>
    </motion.div>
  );
}
