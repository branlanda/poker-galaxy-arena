
import { LobbyTable } from '@/types/lobby';
import { Lock, Users } from 'lucide-react';
import { TableTypeBadge } from './TableTypeBadge';
import { TableStatusBadge } from './TableStatusBadge';
import { useTranslation } from '@/hooks/useTranslation';

interface TableCardHeaderProps {
  table: LobbyTable;
  createdTime: string;
  isNew?: boolean;
}

export function TableCardHeader({ table, createdTime, isNew }: TableCardHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <div className="p-5 border-b border-emerald/10">
      <div className="flex justify-between items-start">
        <div className="max-w-[80%]">
          <h3 className="text-lg font-semibold text-white truncate">
            {table.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {createdTime}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            <TableTypeBadge type={table.table_type} />
            <TableStatusBadge status={table.status} />
            {table.is_private && (
              <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30 text-xs font-medium flex items-center">
                <Lock className="h-3 w-3 mr-1" /> {t('private', 'Privada')}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-gray-300 bg-navy-700/50 rounded-md px-2 py-1">
          <Users className="h-4 w-4 mr-1" />
          <span className="font-medium">
            {table.current_players}/{table.max_players}
          </span>
        </div>
      </div>
    </div>
  );
}
