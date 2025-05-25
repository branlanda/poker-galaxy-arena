import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentGame {
  id: string;
  table_id: string;
  created_at: string;
  pot: number;
  winners_json: any;
}

interface RecentGamesSectionProps {
  games: RecentGame[];
  loading?: boolean;
}

export const RecentGamesSection: React.FC<RecentGamesSectionProps> = ({
  games,
  loading = false
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-navy/70 rounded-md animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (games.length === 0) {
    return (
      <div className="text-center py-8 bg-navy/30 rounded-lg border border-emerald/10">
        <Calendar size={40} className="mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-200 mb-1">
          {t('profile.noGamesYet')}
        </h3>
        <p className="text-gray-400 max-w-md mx-auto mb-4">
          {t('profile.joinTableToPlay')}
        </p>
        <Button onClick={() => navigate('/lobby')}>
          {t('profile.findTable')}
        </Button>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const isWinner = (game: RecentGame, userId: string) => {
    try {
      const winners = Array.isArray(game.winners_json) ? game.winners_json : [];
      return winners.some((winner: any) => winner.player_id === userId);
    } catch (e) {
      return false;
    }
  };
  
  return (
    <div className="space-y-3">
      {games.map((game) => (
        <div 
          key={game.id}
          className="bg-navy/40 rounded-lg border border-emerald/10 p-3 flex justify-between items-center"
        >
          <div>
            <div className="font-medium">
              {t('profile.tablePot', { pot: game.pot.toFixed(2) })}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {formatDate(game.created_at)}
            </div>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate(`/game/${game.table_id}`)}
          >
            {t('profile.viewGame')}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
