
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Trophy, Lock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Tournament } from '@/types/tournaments';
import { useTranslation } from '@/hooks/useTranslation';
import { useTournamentRegistration } from '@/hooks/useTournamentRegistration';
import { TournamentStatusBadge } from './TournamentStatusBadge';

interface TournamentCardProps {
  tournament: Tournament;
  onClick: (tournament: Tournament) => void;
}

export function TournamentCard({ tournament, onClick }: TournamentCardProps) {
  const { t } = useTranslation();
  const { registered, loading, checkRegistration } = useTournamentRegistration(tournament);

  React.useEffect(() => {
    checkRegistration();
  }, [tournament.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPp');
  };

  const timeToStart = (startTime: string) => {
    try {
      return formatDistanceToNow(new Date(startTime), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="h-full flex flex-col hover:border-emerald/50 transition-all duration-200">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <TournamentStatusBadge status={tournament.status} />
          {tournament.is_private && (
            <Badge variant="outline" className="ml-2">
              <Lock className="h-3 w-3 mr-1" /> {t('private', 'Private')}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{tournament.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {tournament.description || t('tournaments.noDescription', 'No description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-emerald" />
            <span>{formatDate(tournament.start_time)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-emerald" />
            <span>{timeToStart(tournament.start_time)}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-emerald" />
            <span>
              {tournament.registered_players_count || 0} / {tournament.max_players} {t('players', 'Players')}
            </span>
          </div>
          <div className="flex items-center">
            <Trophy className="h-4 w-4 mr-2 text-emerald" />
            <span>
              {tournament.buy_in > 0 
                ? t('tournaments.buyIn', 'Buy-in: {amount}', { amount: tournament.buy_in })
                : t('tournaments.freeroll', 'Freeroll')}
            </span>
          </div>
          {tournament.prize_pool > 0 && (
            <div className="mt-2 font-medium">
              {t('tournaments.prizePool', 'Prize Pool: {amount}', { amount: tournament.prize_pool })}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t">
        <Button 
          onClick={() => onClick(tournament)} 
          variant="default" 
          className="w-full"
          disabled={loading}
        >
          {registered 
            ? t('tournaments.viewRegistered', 'View Tournament (Registered)')
            : t('tournaments.viewDetails', 'View Details')}
        </Button>
      </CardFooter>
    </Card>
  );
}
