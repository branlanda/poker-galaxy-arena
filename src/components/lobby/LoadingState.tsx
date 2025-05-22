
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function LoadingState() {
  const { t } = useTranslation();
  
  return (
    <div className="grid place-items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-emerald" />
      <p className="text-gray-400 mt-3">{t('loadingTables', 'Loading tables...')}</p>
    </div>
  );
}
