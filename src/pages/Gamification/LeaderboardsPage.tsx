
import React from 'react';
import { useLeaderboards } from '@/hooks/useLeaderboards';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Medal, Trophy, Clock } from 'lucide-react';

export function LeaderboardsPage() {
  const { t } = useTranslation();
  const { 
    leaderboards, 
    activeLeaderboard, 
    entries, 
    loading, 
    selectLeaderboard 
  } = useLeaderboards();
  
  // Group leaderboards by period
  const groupedLeaderboards = leaderboards.reduce((acc, leaderboard) => {
    if (!acc[leaderboard.period]) {
      acc[leaderboard.period] = [];
    }
    acc[leaderboard.period].push(leaderboard);
    return acc;
  }, {} as Record<string, typeof leaderboards>);
  
  const periods = Object.keys(groupedLeaderboards);

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(word => word[0]?.toUpperCase() || '')
      .slice(0, 2)
      .join('');
  };

  if (loading && leaderboards.length === 0) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <p>{t('loading', 'Loading...')}</p>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('leaderboards.title', 'Leaderboards')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('leaderboards.description', 'See who\'s on top and compete to be the best')}
        </p>
      </div>
      
      {periods.length > 0 && (
        <Tabs 
          defaultValue={periods[0]}
          className="mb-6"
          onValueChange={(value) => {
            if (groupedLeaderboards[value]?.length > 0) {
              selectLeaderboard(groupedLeaderboards[value][0]);
            }
          }}
        >
          <TabsList>
            {periods.map(period => (
              <TabsTrigger key={period} value={period}>
                {period}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {activeLeaderboard?.period && groupedLeaderboards[activeLeaderboard.period]?.map(leaderboard => (
            <Card 
              key={leaderboard.id}
              className={`cursor-pointer hover:bg-muted/50 transition-colors ${leaderboard.id === activeLeaderboard?.id ? 'border-emerald' : ''}`}
              onClick={() => selectLeaderboard(leaderboard)}
            >
              <CardHeader>
                <CardTitle className="text-base">{leaderboard.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {leaderboard.description}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
        
        <div className="lg:col-span-3">
          {activeLeaderboard ? (
            <>
              <Card className="mb-6">
                <CardHeader className="flex flex-row items-center">
                  <div>
                    <CardTitle>{activeLeaderboard.name}</CardTitle>
                    {activeLeaderboard.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {activeLeaderboard.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="ml-auto flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {activeLeaderboard.start_date && activeLeaderboard.end_date ? (
                      <span className="text-muted-foreground">
                        {new Date(activeLeaderboard.start_date).toLocaleDateString()} - {new Date(activeLeaderboard.end_date).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {t('leaderboards.ongoing', 'Ongoing')}
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                {activeLeaderboard.prize_pool ? (
                  <CardContent>
                    <div className="bg-emerald/10 rounded-lg p-4 flex items-center gap-4">
                      <Trophy className="h-8 w-8 text-emerald" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {t('leaderboards.prizePool', 'Prize Pool')}
                        </div>
                        <div className="text-xl font-bold">
                          {activeLeaderboard.prize_pool.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                ) : null}
              </Card>
              
              {loading ? (
                <p className="text-center py-8">{t('loading', 'Loading...')}</p>
              ) : entries.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      {t('leaderboards.noEntries', 'No entries in this leaderboard yet')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {/* Top 3 Players */}
                  {entries.length >= 3 && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {/* 2nd Place */}
                      <Card className="col-start-1">
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2 relative">
                            <Medal className="h-8 w-8 text-gray-500" />
                            <div className="absolute -bottom-2 rounded-full bg-gray-500 text-white w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                            {entries[1]?.player_avatar ? (
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={entries[1].player_avatar} />
                                <AvatarFallback>{getInitials(entries[1].player_name || '')}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                                {getInitials(entries[1].player_name || '')}
                              </div>
                            )}
                          </div>
                          <div className="mt-2 font-medium">{entries[1].player_name}</div>
                          <div className="text-sm text-muted-foreground">{entries[1].score.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                      
                      {/* 1st Place */}
                      <Card className="col-start-2 -mt-4 border-emerald/50">
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-2 relative">
                            <Trophy className="h-10 w-10 text-amber-500" />
                            <div className="absolute -bottom-2 rounded-full bg-amber-500 text-white w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                            {entries[0]?.player_avatar ? (
                              <Avatar className="w-20 h-20">
                                <AvatarImage src={entries[0].player_avatar} />
                                <AvatarFallback>{getInitials(entries[0].player_name || '')}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted">
                                {getInitials(entries[0].player_name || '')}
                              </div>
                            )}
                          </div>
                          <div className="mt-2 font-medium">{entries[0].player_name}</div>
                          <div className="text-sm text-muted-foreground">{entries[0].score.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                      
                      {/* 3rd Place */}
                      <Card className="col-start-3">
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-amber-100/50 flex items-center justify-center mb-2 relative">
                            <Medal className="h-8 w-8 text-amber-700/70" />
                            <div className="absolute -bottom-2 rounded-full bg-amber-700/70 text-white w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                            {entries[2]?.player_avatar ? (
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={entries[2].player_avatar} />
                                <AvatarFallback>{getInitials(entries[2].player_name || '')}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                                {getInitials(entries[2].player_name || '')}
                              </div>
                            )}
                          </div>
                          <div className="mt-2 font-medium">{entries[2].player_name}</div>
                          <div className="text-sm text-muted-foreground">{entries[2].score.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {/* Rest of leaderboard */}
                  <Card>
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">{t('rank', 'Rank')}</th>
                            <th className="text-left py-3 px-4">{t('player', 'Player')}</th>
                            <th className="text-right py-3 px-4">{t('score', 'Score')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.slice(entries.length >= 3 ? 3 : 0).map((entry) => (
                            <tr key={entry.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                                  {entry.rank || '?'}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    {entry.player_avatar ? (
                                      <AvatarImage src={entry.player_avatar} alt={entry.player_name || ''} />
                                    ) : null}
                                    <AvatarFallback>
                                      {getInitials(entry.player_name || 'Unknown')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{entry.player_name || 'Unknown Player'}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right font-medium">
                                {entry.score.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {t('leaderboards.selectLeaderboard', 'Select a leaderboard to view')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
