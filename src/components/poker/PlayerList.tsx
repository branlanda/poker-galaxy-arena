
import { PlayerAtTable } from '@/types/lobby';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PlayerListProps {
  players: PlayerAtTable[];
  maxPlayers: number;
  userId: string | undefined;
}

export function PlayerList({ players, maxPlayers, userId }: PlayerListProps) {
  return (
    <>
      <h3 className="text-sm font-medium mb-4 text-gray-300">Players at Table ({players.length}/{maxPlayers})</h3>
      <div className="space-y-2">
        {players.map(player => (
          <div 
            key={player.id} 
            className="flex items-center justify-between p-2 rounded-sm bg-navy/30"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-emerald/20 text-emerald">
                  {player.player_id === userId ? 'You' : 'P'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {player.player_id === userId ? 'You' : `Player ${player.seat_number !== null ? player.seat_number : '(unseated)' }`}
                </div>
                <div className="text-xs text-gray-400">
                  Stack: {player.stack}
                </div>
              </div>
            </div>
            <div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                player.status === 'ACTIVE' ? 'bg-green-900/50 text-green-300' : 
                player.status === 'AWAY' ? 'bg-amber-900/50 text-amber-300' :
                'bg-gray-800 text-gray-300'
              }`}>
                {player.status}
              </span>
            </div>
          </div>
        ))}
        
        {players.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No players have joined this table yet.
          </div>
        )}
      </div>
    </>
  );
}
