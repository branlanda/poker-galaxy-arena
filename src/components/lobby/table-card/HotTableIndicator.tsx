
import { useTranslation } from '@/hooks/useTranslation';

interface HotTableIndicatorProps {
  isNew?: boolean;
}

export function HotTableIndicator({ isNew = false }: HotTableIndicatorProps) {
  const { t } = useTranslation();
  
  return (
    <div className={`absolute -top-1 -right-1 transform rotate-12 ${isNew ? 'bg-amber-500' : 'bg-emerald-600'} text-white text-xs font-bold px-4 py-1 rounded shadow-lg z-10`}>
      {isNew ? t('newTable', '¡NUEVA!') : t('hotTable', '¡POPULAR!')}
    </div>
  );
}
