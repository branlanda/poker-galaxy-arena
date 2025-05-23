
import { Users, Clock, Activity } from 'lucide-react';
import { LobbyTable } from '@/types/lobby';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { TableStatusBadge } from './TableStatusBadge';
import { TableTypeBadge } from './TableTypeBadge';
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
  const { t, i18n } = useTranslation();
  
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-y-2">
        <div className="text-xs text-gray-400">{t('blinds', 'Blinds')}</div>
        <div className="text-xs font-semibold text-right">
          ${table.small_blind}/{table.big_blind}
        </div>
        
        <div className="text-xs text-gray-400">{t('buyIn', 'Buy-in')}</div>
        <div className="text-xs font-semibold text-right">
          ${table.min_buy_in} - ${table.max_buy_in}
        </div>
        
        <div className="text-xs text-gray-400">{t('tableType', 'Tipo')}</div>
        <div className="text-xs text-right">
          <TableTypeBadge tableType={table.table_type} />
        </div>
        
        <div className="text-xs text-gray-400">{t('status', 'Estado')}</div>
        <div className="text-xs text-right">
          <TableStatusBadge status={table.status} />
        </div>
      </div>
      
      <div className="border-t border-emerald/10 pt-2 grid grid-cols-3">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users className="h-3 w-3" />
            <span>{t('players', 'Jugadores')}</span>
          </div>
          <div className="font-medium">
            <span className={table.current_players === table.max_players ? "text-amber-500" : ""}>
              {table.current_players}
            </span>/{table.max_players}
          </div>
        </div>
        
        <div className="flex flex-col items-center border-l border-r border-emerald/10">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{t('activity', 'Actividad')}</span>
          </div>
          <div className="font-medium text-xs">
            {t('timeAgo', lastActivityTime)}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Activity className="h-3 w-3" />
            <span>{t('playing', 'Jugando')}</span>
          </div>
          <div 
            className={`font-medium ${
              activePlayerCount > 0 ? "text-emerald-500" : "text-gray-500"
            }`}
          >
            {activePlayerCount}
          </div>
        </div>
      </div>
    </div>
  );
}
