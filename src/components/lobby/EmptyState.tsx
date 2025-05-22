
import { TableProperties } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/stores/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { CreateTableDialog } from './CreateTableDialog';
import { TableFilters, DEFAULT_FILTERS } from '@/types/lobby';

interface EmptyStateProps {
  onResetFilters: () => void;
}

export function EmptyState({ onResetFilters }: EmptyStateProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  return (
    <div className="bg-navy/30 border border-emerald/10 rounded-lg py-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-emerald/10">
          <TableProperties className="h-10 w-10 text-emerald" />
        </div>
      </div>
      <h3 className="text-xl font-medium text-gray-300">{t('noTablesFound', 'No tables found')}</h3>
      <p className="text-gray-400 mt-2 max-w-md mx-auto">
        {user ? 
          t('noTablesMatch', 'No tables match your current filters. Adjust your filters or create a new table to start playing!') : 
          t('logInToPlay', 'Log in to create your own table or join an existing one!')}
      </p>
      {user && (
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" onClick={onResetFilters}>
            {t('clearFilters', 'Clear Filters')}
          </Button>
          <CreateTableDialog />
        </div>
      )}
      {!user && (
        <div className="mt-6">
          <Button onClick={() => window.location.href = '/login'}>
            {t('logInToPlay', 'Log In to Play')}
          </Button>
        </div>
      )}
    </div>
  );
}
