
import { Lock } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import { useTranslation } from '@/hooks/useTranslation';
import { TableTypeBadge } from './TableTypeBadge';
import { TableStatusBadge } from './TableStatusBadge';
import { LobbyTable } from '@/types/lobby';

interface TableCardHeaderProps {
  table: LobbyTable;
  createdTime: string;
}

export function TableCardHeader({ table, createdTime }: TableCardHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-emerald truncate flex items-center gap-2">
            {table.name}
            {table.is_private && <Lock size={14} className="text-amber-400" />}
          </h3>
          <p className="text-gray-400 text-xs">{t('created')} {createdTime}</p>
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          <TableTypeBadge tableType={table.table_type} />
          <TableStatusBadge status={table.status} />
        </div>
      </div>
    </CardHeader>
  );
}
