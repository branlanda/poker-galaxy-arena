
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Users, DollarSign, Clock, Zap } from 'lucide-react';
import { SitAndGoGame } from '@/types/sitAndGo';
import { useAuth } from '@/stores/auth';

interface SitAndGoCardProps {
  game: SitAndGoGame;
  onJoin: (gameId: string, seatNumber: number) => void;
  onLeave: (gameId: string) => void;
}

export const SitAndGoCard: React.FC<SitAndGoCardProps> = ({ game, onJoin, onLeave }) => {
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'STARTING':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'RUNNING':
        return 'bg-emerald/20 text-emerald border-emerald/30';
      case 'COMPLETED':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case 'TURBO':
        return <Zap className="h-3 w-3" />;
      case 'HYPER_TURBO':
        return <Zap className="h-3 w-3 text-orange-500" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const isPlayerInGame = user && game.players?.some(p => p.player_id === user.id);
  const canJoin = game.status === 'WAITING' && !isPlayerInGame && (game.current_players || 0) < game.max_players;
  const canLeave = game.status === 'WAITING' && isPlayerInGame;

  const getNextSeatNumber = () => {
    const usedSeats = new Set(game.players?.map(p => p.seat_number) || []);
    for (let i = 1; i <= game.max_players; i++) {
      if (!usedSeats.has(i)) {
        return i;
      }
    }
    return 1;
  };

  const calculatePrizePool = () => {
    return game.buy_in * (game.current_players || 0);
  };

  return (
    <Card className="bg-navy/50 border-emerald/20 hover:border-emerald/40 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">{game.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(game.status)}>
              {game.status}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              {getGameTypeIcon(game.game_type)}
              {game.game_type.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Game Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald" />
            <span className="text-gray-300">
              {game.current_players || 0}/{game.max_players}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald" />
            <span className="text-gray-300">${game.buy_in}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-emerald" />
            <span className="text-gray-300">${calculatePrizePool()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Starting Chips:</span>
            <span className="text-xs text-gray-300">{game.starting_chips.toLocaleString()}</span>
          </div>
        </div>

        {/* Players */}
        {game.players && game.players.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Players:</h4>
            <div className="flex flex-wrap gap-2">
              {game.players.map((player) => (
                <div key={player.id} className="flex items-center gap-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={player.profiles?.avatar_url} />
                    <AvatarFallback className="bg-emerald/20 text-emerald text-xs">
                      {(player.profiles?.alias || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-300">
                    {player.profiles?.alias || 'Unknown'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blind Structure Preview */}
        {game.blind_structure && game.blind_structure.length > 0 && (
          <div className="text-xs text-gray-400">
            <span>Level {game.current_level}: </span>
            <span className="text-emerald">
              {game.blind_structure[0]?.small_blind}/{game.blind_structure[0]?.big_blind}
            </span>
            {game.blind_structure[0]?.ante > 0 && (
              <span className="text-emerald"> ({game.blind_structure[0]?.ante})</span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        {canJoin && (
          <Button 
            onClick={() => onJoin(game.id, getNextSeatNumber())}
            className="w-full"
          >
            Join Game
          </Button>
        )}
        {canLeave && (
          <Button 
            onClick={() => onLeave(game.id)}
            variant="outline"
            className="w-full"
          >
            Leave Game
          </Button>
        )}
        {game.status === 'RUNNING' && isPlayerInGame && (
          <Button className="w-full">
            Enter Game
          </Button>
        )}
        {!user && (
          <Button disabled className="w-full">
            Login to Join
          </Button>
        )}
        {game.status === 'COMPLETED' && (
          <Button disabled className="w-full">
            Game Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
