
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { HotTableIndicator } from './HotTableIndicator';

export interface TableCardHeaderProps {
  table: {
    name: string;
    creator_id: string;
  };
  createdTime: string;
  isNew?: boolean;
  isHot?: boolean;
}

export function TableCardHeader({ table, createdTime, isNew = false, isHot = false }: TableCardHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <div className="relative">
      {(isNew || isHot) && (
        <HotTableIndicator isNew={isNew} />
      )}
      <h3 className="text-lg font-semibold truncate">{table.name}</h3>
      <p className="text-sm text-gray-400">
        {t('created', 'Created')} {formatDistanceToNow(new Date(createdTime), { addSuffix: true })}
      </p>
    </div>
  );
}
