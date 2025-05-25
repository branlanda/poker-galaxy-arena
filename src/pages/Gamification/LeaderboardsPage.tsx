
import React from 'react';
import { useLeaderboards } from '@/hooks/useLeaderboards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

const LeaderboardsPage = () => {
  const { t } = useTranslation();
  const { leaderboards, loading } = useLeaderboards();

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-emerald">#{position}</span>;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald mb-2">
            {t('leaderboards.title', 'Leaderboards')}
          </h1>
          <p className="text-gray-400">
            {t('leaderboards.description', 'See how you rank against other players')}
          </p>
        </div>

        <Tabs defaultValue="earnings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="earnings" className="text-white">
              {t('leaderboards.earnings', 'Earnings')}
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="text-white">
              {t('leaderboards.tournaments', 'Tournaments')}
            </TabsTrigger>
            <TabsTrigger value="hands" className="text-white">
              {t('leaderboards.hands', 'Hands Played')}
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-white">
              {t('leaderboards.monthly', 'Monthly')}
            </TabsTrigger>
          </TabsList>

          {Object.entries(leaderboards).map(([category, players]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <Card className="bg-navy/70 border-emerald/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald">
                    <Trophy className="h-5 w-5" />
                    {t(`leaderboards.${category}`, category.charAt(0).toUpperCase() + category.slice(1))} Leaderboard
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {t('leaderboards.topPlayers', 'Top performing players in this category')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {players.map((player, index) => (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:border-emerald/40 ${
                          index < 3 
                            ? 'bg-emerald/5 border-emerald/30' 
                            : 'bg-navy/50 border-emerald/10'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12">
                            {getRankIcon(index + 1)}
                          </div>
                          
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={player.avatarUrl} alt={player.alias} />
                            <AvatarFallback className="bg-emerald/20 text-emerald">
                              {player.alias?.charAt(0).toUpperCase() || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h3 className="font-semibold text-white">
                              {player.alias || 'Anonymous Player'}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {t('leaderboards.level', 'Level')} {player.level || 1}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald" />
                            <span className="text-lg font-bold text-white">
                              {category === 'earnings' ? `$${player.stats?.earnings?.toLocaleString() || 0}` :
                               category === 'tournaments' ? `${player.stats?.tournamentsWon || 0} wins` :
                               category === 'hands' ? `${player.stats?.handsPlayed?.toLocaleString() || 0}` :
                               `$${player.stats?.monthlyEarnings?.toLocaleString() || 0}`}
                            </span>
                          </div>
                          {index < 3 && (
                            <Badge 
                              variant="secondary" 
                              className="mt-1 bg-emerald/20 text-emerald"
                            >
                              {index === 0 ? 'Champion' : index === 1 ? 'Runner-up' : 'Third Place'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default LeaderboardsPage;
