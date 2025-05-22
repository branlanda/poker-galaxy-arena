
import { LobbyTable } from '@/types/lobby';
import { Users, Clock, Activity, DollarSign } from 'lucide-react';
import { TableTypeBadge } from './TableTypeBadge';
import { TableStatusBadge } from './TableStatusBadge';
import { useTranslation } from '@/hooks/useTranslation';

interface TableInfoGridProps {
  table: LobbyTable;
  lastActivityTime: string;
  activityStatus: 'active' | 'idle' | 'inactive';
  activePlayerCount: number;
}

export function TableInfoGrid({ 
  table, 
  lastActivityTime, 
  activityStatus,
  activePlayerCount 
}: TableInfoGridProps) {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 pt-0">
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <div className="flex items-center text-gray-300">
          <Users className="h-4 w-4 mr-1.5 text-emerald-400" aria-hidden="true" />
          <span>
            {t('playersCount', 'Jugadores')}: <span className="font-semibold text-white">{table.current_players}/{table.max_players}</span>
          </span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <DollarSign className="h-4 w-4 mr-1.5 text-emerald-400" aria-hidden="true" />
          <span>
            {t('blinds', 'Ciegas')}: <span className="font-semibold text-white">${table.small_blind}/{table.big_blind}</span>
          </span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Activity className={`h-4 w-4 mr-1.5 ${activityStatus === 'active' ? 'text-emerald-400 animate-pulse' : activityStatus === 'idle' ? 'text-amber-400' : 'text-gray-400'}`} aria-hidden="true" />
          <div className="flex items-center">
            <span>{t('activity', 'Actividad')}: </span>
            {activePlayerCount > 0 ? (
              <span className="font-semibold text-white ml-1">
                {activePlayerCount} {t('activePlayers', 'jugando')}
              </span>
            ) : (
              <span className="text-gray-400 ml-1">{t('inactive', 'inactiva')}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Clock className="h-4 w-4 mr-1.5 text-emerald-400" aria-hidden="true" />
          <span className="text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">{lastActivityTime}</span>
        </div>
        
        <div className="col-span-2 flex space-x-2 mt-1.5">
          <TableTypeBadge type={table.table_type} />
          <TableStatusBadge 
            status={table.status} 
            isPrivate={table.is_private}
          />
        </div>
      </div>
    </div>
  );
}
