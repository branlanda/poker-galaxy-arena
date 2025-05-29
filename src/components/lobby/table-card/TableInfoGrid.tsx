
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
        <div className="text-xs text-black">{t('blinds', 'Blinds')}</div>
        <div className="text-xs font-semibold text-right text-black">
          ${table.small_blind}/{table.big_blind}
        </div>
        
        <div className="text-xs text-black">{t('buyIn', 'Buy-in')}</div>
        <div className="text-xs font-semibold text-right text-black">
          ${table.min_buy_in} - ${table.max_buy_in}
        </div>
        
        <div className="text-xs text-black">{t('tableType', 'Tipo')}</div>
        <div className="text-xs text-right">
          <TableTypeBadge type={table.table_type} />
        </div>
        
        <div className="text-xs text-black">{t('status', 'Estado')}</div>
        <div className="text-xs text-right">
          <TableStatusBadge status={table.status} />
        </div>
      </div>
      
      <div className="border-t border-black pt-2 grid grid-cols-3">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-xs text-black">
            <Users className="h-3 w-3 text-black" />
            <span>{t('players', 'Jugadores')}</span>
          </div>
          <div className="font-medium text-black">
            <span className={table.current_players === table.max_players ? "text-amber-600" : "text-black"}>
              {table.current_players}
            </span>/{table.max_players}
          </div>
        </div>
        
        <div className="flex flex-col items-center border-l border-r border-black">
          <div className="flex items-center gap-1 text-xs text-black">
            <Clock className="h-3 w-3 text-black" />
            <span>{t('activity', 'Actividad')}</span>
          </div>
          <div className="font-medium text-xs text-black">
            {t('timeAgo', lastActivityTime)}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-xs text-black">
            <Activity className="h-3 w-3 text-black" />
            <span>{t('playing', 'Jugando')}</span>
          </div>
          <div 
            className={`font-medium ${
              activePlayerCount > 0 ? "text-green-600" : "text-black"
            }`}
          >
            {activePlayerCount}
          </div>
        </div>
      </div>
    </div>
  );
}
