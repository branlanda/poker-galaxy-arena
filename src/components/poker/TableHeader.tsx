
import { Button } from '@/components/ui/Button';
import { LobbyTable } from '@/types/lobby';
import { Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface TableHeaderProps {
  table: LobbyTable;
  onLeaveTable: () => void;
}

export function TableHeader({ table, onLeaveTable }: TableHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald">{table.name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
          <span>{t('poker.blinds')}: {table.small_blind}/{table.big_blind}</span>
          <span aria-hidden="true">•</span>
          <span>{t('poker.buyIn')}: {table.min_buy_in}-{table.max_buy_in}</span>
          <span aria-hidden="true">•</span>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" aria-hidden="true" /> 
            <span>{t('poker.hand')} #{table.hand_number || 0}</span>
          </div>
        </div>
      </div>
      <Button 
        variant="outline" 
        onClick={onLeaveTable}
        aria-label={t('poker.leaveTable')}
      >
        {t('poker.leaveTable')}
      </Button>
    </div>
  );
}
