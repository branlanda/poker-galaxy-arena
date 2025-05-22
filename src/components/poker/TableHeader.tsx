
import { Button } from '@/components/ui/Button';
import { LobbyTable } from '@/types/lobby';
import { Clock } from 'lucide-react';

interface TableHeaderProps {
  table: LobbyTable;
  onLeaveTable: () => void;
}

export function TableHeader({ table, onLeaveTable }: TableHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald">{table.name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
          <span>Blinds: {table.small_blind}/{table.big_blind}</span>
          <span>•</span>
          <span>Buy-in: {table.min_buy_in}-{table.max_buy_in}</span>
          <span>•</span>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" /> 
            <span>Hand #{table.hand_number || 0}</span>
          </div>
        </div>
      </div>
      <Button variant="outline" onClick={onLeaveTable}>
        Leave Table
      </Button>
    </div>
  );
}
