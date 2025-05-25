
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameHistoryItem } from '@/hooks/usePlayerStatistics';
import { useTranslation } from '@/hooks/useTranslation';
import { TrendingUp, TrendingDown, Calendar, Trophy, Coins } from 'lucide-react';

interface GameHistoryTableProps {
  gameHistory: GameHistoryItem[];
  loading?: boolean;
}

export const GameHistoryTable: React.FC<GameHistoryTableProps> = ({
  gameHistory,
  loading = false
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return 'N/A';
    // Parse PostgreSQL interval format
    const match = duration.match(/(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, hours, minutes] = match;
      if (parseInt(hours) > 0) {
        return `${parseInt(hours)}h ${parseInt(minutes)}m`;
      }
      return `${parseInt(minutes)}m`;
    }
    return duration;
  };

  if (loading) {
    return (
      <Card className="bg-navy/70 border-emerald/20">
        <CardHeader>
          <CardTitle className="text-white">Game History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-navy/50 rounded-md animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameHistory.length === 0) {
    return (
      <Card className="bg-navy/70 border-emerald/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Game History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No games played yet</p>
            <p className="text-sm">Your game history will appear here once you start playing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-navy/70 border-emerald/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Game History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {gameHistory.map((game) => (
            <div
              key={game.id}
              className="bg-navy/40 rounded-lg border border-emerald/10 p-4 hover:border-emerald/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {game.gameType === 'TOURNAMENT' ? (
                      <Trophy className="h-5 w-5 text-gold" />
                    ) : (
                      <Coins className="h-5 w-5 text-emerald" />
                    )}
                    <div>
                      <p className="font-medium text-white">{game.tableName}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Badge variant="outline" className="text-xs">
                          {game.gameType === 'TOURNAMENT' ? 'Tournament' : 'Cash Game'}
                        </Badge>
                        <span>•</span>
                        <span>Buy-in: Ξ{game.buyIn?.toFixed(2) || '0.00'}</span>
                        {game.duration && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(game.duration)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${
                      game.result >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {game.result >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {game.result >= 0 ? '+' : ''}Ξ{game.result.toFixed(2)}
                      </span>
                    </div>
                    {game.position && (
                      <p className="text-xs text-gray-400">
                        Position: {game.position}
                      </p>
                    )}
                  </div>

                  <div className="text-right text-sm text-gray-400">
                    <p>{formatDate(game.playedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {gameHistory.length >= 50 && (
          <div className="text-center mt-4 text-sm text-gray-400">
            Showing last 50 games
          </div>
        )}
      </CardContent>
    </Card>
  );
};
