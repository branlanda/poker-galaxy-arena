
import { Activity, Clock, Users } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';
import { LobbyTable } from '@/types/lobby';
import { CardContent } from "@/components/ui/card";

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
    <CardContent className="pb-4 pt-2">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-400">{t('blinds')}</p>
          <p className="font-medium">{table.small_blind} / {table.big_blind}</p>
        </div>
        <div>
          <p className="text-gray-400">{t('buyIn')}</p>
          <p className="font-medium">{table.min_buy_in} - {table.max_buy_in}</p>
        </div>
        <div className="flex items-center gap-1">
          <Users className={`h-4 w-4 ${table.current_players > 0 ? 'text-emerald' : 'text-gray-400'}`} />
          <div>
            <p className="text-gray-400">{t('players')}</p>
            <p className="font-medium">
              <span>{table.current_players} / {table.max_players}</span>
              {activePlayerCount > 0 && (
                <span className="text-emerald ml-1">({activePlayerCount} {t('active')})</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Activity className={`h-4 w-4 ${
            activityStatus === 'active' ? 'text-emerald' :
            activityStatus === 'idle' ? 'text-amber-400' : 
            'text-gray-500'
          }`} />
          <div>
            <p className="text-gray-400">{t('activity')}</p>
            <p className="text-xs font-medium">{lastActivityTime}</p>
          </div>
        </div>
        {table.hand_number > 0 && (
          <div className="flex items-center gap-1 col-span-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-400">{t('currentHand', 'Current Hand')}</p>
              <p className="font-medium">#{table.hand_number}</p>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
}
