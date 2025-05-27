
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Trophy, 
  Clock,
  Target,
  Coins,
  RefreshCw
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Tournament } from '@/types/tournaments';

interface TournamentInfoHeaderProps {
  tournament: Tournament;
  registrationsCount: number;
  onRefresh?: () => void;
}

export const TournamentInfoHeader: React.FC<TournamentInfoHeaderProps> = ({
  tournament,
  registrationsCount,
  onRefresh
}) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'registering':
        return 'bg-emerald/20 text-emerald border-emerald/30';
      case 'running':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculatePrizePool = () => {
    return tournament.buy_in * registrationsCount;
  };

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{tournament.name}</h1>
            <Badge className={getStatusColor(tournament.status)}>
              {tournament.status?.toUpperCase()}
            </Badge>
            {tournament.is_featured && (
              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                FEATURED
              </Badge>
            )}
          </div>
          <p className="text-gray-400 max-w-2xl">
            {tournament.description || 'Join this exciting tournament and compete for the prize pool!'}
          </p>
        </div>
        
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>

      {/* Key Information Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-navy/50 border-emerald/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-emerald" />
              <span className="text-sm text-gray-400">Start Time</span>
            </div>
            <p className="font-semibold text-white text-sm">
              {formatDateTime(tournament.start_time)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-emerald/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-emerald" />
              <span className="text-sm text-gray-400">Players</span>
            </div>
            <p className="font-semibold text-white">
              {registrationsCount} / {tournament.max_players}
            </p>
            <p className="text-xs text-gray-500">
              Min: {tournament.min_players}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-emerald/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-emerald" />
              <span className="text-sm text-gray-400">Buy-in</span>
            </div>
            <p className="font-semibold text-white">${tournament.buy_in}</p>
            <p className="text-xs text-gray-500">
              +{tournament.fee_percent}% fee
            </p>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-emerald/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-emerald" />
              <span className="text-sm text-gray-400">Prize Pool</span>
            </div>
            <p className="font-semibold text-white">${calculatePrizePool().toLocaleString()}</p>
            <p className="text-xs text-gray-500">Guaranteed</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-navy/30 border-emerald/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-400">Starting Chips</span>
            </div>
            <p className="text-sm font-medium text-white">
              {tournament.starting_chips?.toLocaleString() || '10,000'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-navy/30 border-emerald/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-400">Late Reg</span>
            </div>
            <p className="text-sm font-medium text-white">
              {tournament.late_registration_minutes || 30} min
            </p>
          </CardContent>
        </Card>

        <Card className="bg-navy/30 border-emerald/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-400">Current Level</span>
            </div>
            <p className="text-sm font-medium text-white">
              {tournament.current_level || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-navy/30 border-emerald/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-400">Type</span>
            </div>
            <p className="text-sm font-medium text-white">
              {tournament.tournament_type?.replace('_', ' ') || 'Multi-Table'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
