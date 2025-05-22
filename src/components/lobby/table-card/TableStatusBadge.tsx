
import { Badge } from "@/components/ui/badge";
import { TableStatus } from '@/types/lobby';

interface TableStatusBadgeProps {
  status: TableStatus;
}

export function TableStatusBadge({ status }: TableStatusBadgeProps) {
  return (
    <Badge variant={
      status === 'WAITING' ? 'outline' : 
      status === 'ACTIVE' ? 'default' :
      status === 'PAUSED' ? 'secondary' : 'destructive'
    }>
      {status}
    </Badge>
  );
}
