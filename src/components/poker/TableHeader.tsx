
import { LobbyTable } from '@/types/lobby';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Info, Users, Clock } from 'lucide-react';
import { TableTypeBadge } from '../lobby/table-card/TableTypeBadge';
import { TableStatusBadge } from '../lobby/table-card/TableStatusBadge';

export interface TableHeaderProps {
  table: LobbyTable;
  onLeaveTable: () => void;
}

export function TableHeader({ table, onLeaveTable }: TableHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-navy-800/60 border border-emerald/10 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onLeaveTable}
              className="h-8 w-8 rounded-full bg-navy-700/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h1 className="text-xl font-bold">{table.name}</h1>
            
            <div className="flex gap-2">
              <TableTypeBadge type={table.table_type} />
              <TableStatusBadge status={table.status} />
              {table.is_private && (
                <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30 text-xs font-medium">
                  {t('private', 'Privada')}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-1" />
              {t('blinds', 'Blinds')}: ${table.small_blind} / ${table.big_blind}
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {t('players', 'Jugadores')}: {table.current_players}/{table.max_players}
            </div>
            
            {table.hand_number > 0 && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {t('handNumber', 'Mano')}: #{table.hand_number}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            {t('inviteFriends', 'Invitar amigos')}
          </Button>
        </div>
      </div>
    </div>
  );
}
