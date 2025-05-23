
import { TableType } from '@/types/lobby';
import { useTranslation } from '@/hooks/useTranslation';

interface TableTypeBadgeProps {
  type: TableType;
  className?: string;
}

export function TableTypeBadge({ type, className = '' }: TableTypeBadgeProps) {
  const { t } = useTranslation();
  
  const getTypeConfig = () => {
    switch (type) {
      case 'CASH':
        return {
          label: t('tableType.cash', 'Efectivo'),
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        };
      case 'TOURNAMENT':
        return {
          label: t('tableType.tournament', 'Torneo'),
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        };
      default:
        return {
          label: type,
          color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        };
    }
  };
  
  const { label, color } = getTypeConfig();
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${color} ${className}`}>
      {label}
    </span>
  );
}
