
import { LobbyTable } from '@/types/lobby';
import { DollarSign, Clock, Activity, Users } from 'lucide-react';
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
  
  const activityStatusColors = {
    active: "text-emerald-400",
    idle: "text-amber-400",
    inactive: "text-gray-500"
  };
  
  return (
    <div className="grid grid-cols-2 p-5 gap-4">
      <div>
        <div className="text-gray-400 text-xs flex items-center">
          <DollarSign className="h-3 w-3 mr-1" /> {t('blinds', 'Blinds')}
        </div>
        <div className="font-medium">
          ${table.small_blind} / ${table.big_blind}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {t('buyIn', 'Buy-in')}: ${table.min_buy_in} - ${table.max_buy_in}
        </div>
      </div>
      
      <div>
        <div className="text-gray-400 text-xs flex items-center">
          <Activity className="h-3 w-3 mr-1" /> {t('activity', 'Actividad')}
        </div>
        <div className={`font-medium ${activityStatusColors[activityStatus]}`}>
          {activityStatus === 'active' ? t('active', 'Activa') : 
           activityStatus === 'idle' ? t('idle', 'Inactiva') : 
           t('inactive', 'Sin actividad')}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {lastActivityTime}
        </div>
      </div>
      
      <div>
        <div className="text-gray-400 text-xs flex items-center">
          <Users className="h-3 w-3 mr-1" /> {t('activePlayers', 'Jugando')}
        </div>
        <div className="font-medium">
          {activePlayerCount > 0 ? activePlayerCount : t('noActivePlayers', 'Ninguno')}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {t('ofTotalPlayers', 'de {total} jugadores', { total: table.current_players })}
        </div>
      </div>
      
      <div>
        <div className="text-gray-400 text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" /> {t('handNumber', 'Hand #')}
        </div>
        <div className="font-medium">
          {table.hand_number > 0 ? table.hand_number : t('notStarted', 'No iniciada')}
        </div>
      </div>
    </div>
  );
}
