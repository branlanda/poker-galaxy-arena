
import { TableStatus } from '@/types/lobby';
import { useTranslation } from '@/hooks/useTranslation';

interface TableStatusBadgeProps {
  status: TableStatus;
  className?: string;
}

export function TableStatusBadge({ status, className = '' }: TableStatusBadgeProps) {
  const { t } = useTranslation();
  
  const getStatusConfig = () => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: t('tableStatus.active', 'Activa'),
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        };
      case 'WAITING':
        return {
          label: t('tableStatus.waiting', 'Esperando'),
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        };
      case 'PAUSED':
        return {
          label: t('tableStatus.paused', 'Pausada'),
          color: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        };
      case 'FINISHED':
        return {
          label: t('tableStatus.finished', 'Finalizada'),
          color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        };
      case 'CLOSED':
        return {
          label: t('tableStatus.closed', 'Cerrada'),
          color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        };
      default:
        return {
          label: String(status),
          color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        };
    }
  };
  
  const { label, color } = getStatusConfig();
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${color} ${className}`}>
      {label}
    </span>
  );
}
