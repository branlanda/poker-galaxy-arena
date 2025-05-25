
import React, { useState, useEffect } from 'react';
import { useTournamentStats } from '@/hooks/useTournamentStats';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, Users, Clock, DollarSign, Target, Award, BarChart3 } from 'lucide-react';

interface TournamentStatsSectionProps {
  playerId?: string;
  className?: string;
}

export const TournamentStatsSection: React.FC<TournamentStatsSectionProps> = ({ 
  playerId, 
  className = '' 
}) => {
  const { playerHistory, tournamentStats, loading, fetchPlayerHistory, fetchTournamentStats, getLeaderboard } = useTournamentStats();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('all');
  const { t } = useTranslation();

  useEffect(() => {
    if (playerId) {
      fetchPlayerHistory(playerId);
      fetchTournamentStats(playerId);
    }
  }, [playerId]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const data = await getLeaderboard(timeframe);
      setLeaderboard(data);
    };
    loadLeaderboard();
  }, [timeframe]);

  const calculateWinRate = () => {
    if (!playerHistory || playerHistory.tournaments_played === 0) return 0;
    return ((playerHistory.tournaments_won / playerHistory.tournaments_played) * 100).toFixed(1);
  };

  const calculateITMRate = () => {
    if (!playerHistory || playerHistory.tournaments_played === 0) return 0;
    return ((playerHistory.tournaments_final_table / playerHistory.tournaments_played) * 100).toFixed(1);
  };

  const getRecentPerformance = () => {
    const recent = tournamentStats.slice(0, 5);
    const avgPosition = recent.length > 0 
      ? recent.reduce((sum, stat) => sum + (stat.final_position || 0), 0) / recent.length 
      : 0;
    return avgPosition.toFixed(1);
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-navy/70 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-navy/50 border-emerald/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-400">{t('tournaments.stats.tournamentsWon', 'Wins')}</span>
            </div>
            <p className="text-2xl font-bold text-white">{playerHistory?.tournaments_won || 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-emerald/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-emerald" />
              <span className="text-sm text-gray-400">{t('tournaments.stats.tournamentsPlayed', 'Played')}</span>
            </div>
            <p className="text-2xl font-bold text-white">{playerHistory?.tournaments_played || 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-emerald/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-400">{t('tournaments.stats.winRate', 'Win Rate')}</span>
            </div>
            <p className="text-2xl font-bold text-white">{calculateWinRate()}%</p>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-emerald/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-400">{t('tournaments.stats.itm', 'ITM Rate')}</span>
            </div>
            <p className="text-2xl font-bold text-white">{calculateITMRate()}%</p>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-emerald/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-400">{t('tournaments.stats.totalPrize', 'Prize Money')}</span>
            </div>
            <p className="text-2xl font-bold text-white">${playerHistory?.total_prize_money || 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-emerald/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-400">{t('tournaments.stats.roi', 'ROI')}</span>
            </div>
            <p className="text-2xl font-bold text-white">{playerHistory?.roi?.toFixed(1) || 0}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="bg-navy/60 border border-emerald/20">
          <TabsTrigger value="history" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
            <BarChart3 className="h-4 w-4 mr-2" />
            {t('tournaments.stats.history', 'History')}
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
            <Trophy className="h-4 w-4 mr-2" />
            {t('tournaments.stats.leaderboard', 'Leaderboard')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-6">
          <Card className="bg-navy/50 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">{t('tournaments.stats.recentTournaments', 'Recent Tournaments')}</CardTitle>
              <CardDescription className="text-gray-400">
                {t('tournaments.stats.recentDescription', 'Your performance in recent tournaments')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tournamentStats.length > 0 ? (
                <div className="space-y-4">
                  {tournamentStats.slice(0, 10).map((stat: any) => (
                    <div key={stat.id} className="flex items-center justify-between p-4 bg-navy/30 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{stat.tournaments_new?.name || 'Unknown Tournament'}</h4>
                        <p className="text-sm text-gray-400">
                          {new Date(stat.tournaments_new?.start_time || stat.created_at).toLocaleDateString()} • 
                          Buy-in: ${stat.tournaments_new?.buy_in || 0}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {stat.final_position && (
                          <Badge 
                            variant={stat.final_position <= 3 ? "default" : "secondary"}
                            className={stat.final_position <= 3 ? "bg-emerald/20 text-emerald border-emerald/30" : ""}
                          >
                            #{stat.final_position}
                          </Badge>
                        )}
                        {stat.prize_amount > 0 && (
                          <span className="text-green-500 font-medium">+${stat.prize_amount}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">
                  {t('tournaments.stats.noHistory', 'No tournament history available')}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <Card className="bg-navy/50 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>{t('tournaments.stats.topPlayers', 'Top Players')}</span>
                <div className="flex gap-2">
                  {(['week', 'month', 'all'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeframe(period)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        timeframe === period 
                          ? 'bg-emerald/20 text-emerald' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div key={player.id} className="flex items-center gap-4 p-3 bg-navy/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-amber-600' : 'text-white'
                      }`}>
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{player.profiles?.alias || 'Anonymous'}</p>
                      <p className="text-sm text-gray-400">
                        {player.tournaments_played} tournaments • {player.tournaments_won} wins
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald font-medium">{player.roi?.toFixed(1)}% ROI</p>
                      <p className="text-sm text-gray-400">${player.total_prize_money}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
