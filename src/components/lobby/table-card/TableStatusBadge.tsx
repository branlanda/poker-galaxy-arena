
import { Badge } from '@/components/ui/badge';
import { TableStatus } from '@/types/lobby';
import { useTranslation } from '@/hooks/useTranslation';

export interface TableStatusBadgeProps {
  status: TableStatus;
  isPrivate?: boolean;
}

export function TableStatusBadge({ status, isPrivate = false }: TableStatusBadgeProps) {
  const { t } = useTranslation();

  // Determine variant and text based on status and privacy
  const getVariant = () => {
    if (isPrivate) return "warning";
    
    switch(status) {
      case 'ACTIVE': return "success";
      case 'WAITING': return "default";
      case 'PAUSED': return "secondary";
      case 'FINISHED': return "outline";
      default: return "default";
    }
  };
  
  const getText = () => {
    if (isPrivate) return t('private', 'Private');
    
    switch(status) {
      case 'ACTIVE': return t('active', 'Active');
      case 'WAITING': return t('waiting', 'Waiting');
      case 'PAUSED': return t('paused', 'Paused');
      case 'FINISHED': return t('finished', 'Finished');
      default: return status;
    }
  };

  return (
    <Badge variant={getVariant()}>{getText()}</Badge>
  );
}
