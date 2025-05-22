
import { Badge } from '@/components/ui/badge';
import { TableType } from '@/types/lobby';
import { useTranslation } from '@/hooks/useTranslation';

export interface TableTypeBadgeProps {
  type: TableType;
}

export function TableTypeBadge({ type }: TableTypeBadgeProps) {
  const { t } = useTranslation();
  
  // Determine variant and text based on type
  const getVariant = () => {
    switch(type) {
      case 'CASH': return "default";
      case 'TOURNAMENT': return "secondary";
      default: return "outline";
    }
  };
  
  const getText = () => {
    switch(type) {
      case 'CASH': return t('cash', 'Cash');
      case 'TOURNAMENT': return t('tournament', 'Tournament');
      default: return type;
    }
  };

  return (
    <Badge variant={getVariant()} className="uppercase">{getText()}</Badge>
  );
}
