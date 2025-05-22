
import { Badge } from "@/components/ui/badge";
import { TableType } from '@/types/lobby';

interface TableTypeBadgeProps {
  tableType: TableType;
}

export function TableTypeBadge({ tableType }: TableTypeBadgeProps) {
  return (
    <Badge variant={tableType === 'CASH' ? "outline" : "secondary"}>
      {tableType}
    </Badge>
  );
}
