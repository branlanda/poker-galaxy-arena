
import { Chip, X, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { LobbyTable } from '@/types/lobby';

interface TableHeaderProps {
  table: LobbyTable;
  onLeaveTable: () => void;
}

export function TableHeader({ table, onLeaveTable }: TableHeaderProps) {
  const blindsText = `${table.small_blind} / ${table.big_blind}`;
  const timeAgo = formatDistanceToNow(new Date(table.created_at), { addSuffix: true });

  return (
    <div className="flex flex-wrap justify-between items-center bg-navy/50 border border-emerald/10 rounded-lg p-4 mb-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold">{table.name}</h1>
          {table.is_private && (
            <Badge variant="warning">Private</Badge>
          )}
          <Badge variant={table.status === 'ACTIVE' ? 'success' : 'default'}>
            {table.status}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Chip className="h-4 w-4" />
            <span>Blinds: {blindsText}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              Players: {table.current_players}/{table.max_players}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Created {timeAgo}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 md:mt-0">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onLeaveTable}
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Leave Table
        </Button>
      </div>
    </div>
  );
}
