
import { PlayerAtTable } from '@/types/lobby';
import { GameState } from '@/types/poker';

interface PlayerListProps {
  players: PlayerAtTable[];
  gameState?: GameState | null;
}

export function PlayerList({ players, gameState }: PlayerListProps) {
  return (
    <div className="space-y-4">
      {players.map((player) => (
        <div 
          key={player.player_id} 
          className="flex items-center justify-between bg-navy-700/30 p-3 rounded-md border border-navy-600/30"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-900/30 rounded-full flex items-center justify-center mr-3">
              {player.player_name?.substring(0, 2) || 'P'}
            </div>
            <div>
              <div className="font-medium">{player.player_name || 'Player'}</div>
              <div className="text-xs text-gray-400">Seat {player.seat_number || '-'}</div>
            </div>
          </div>
          <div className="font-medium">
            ${player.stack.toLocaleString()}
          </div>
        </div>
      ))}
      
      {players.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No players at the table yet.
        </div>
      )}
    </div>
  );
}
