
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLeaderboards } from '@/hooks/useLeaderboards';
import { useAuth } from '@/stores/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaderboard, LeaderboardEntry } from '@/types/gamification';
import { Medal, MedalFirst, MedalSecond, Trophy, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function LeaderboardsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { leaderboards, leaderboardEntries, loading, fetchLeaderboardEntries } = useLeaderboards();
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>('weekly');

  useEffect(() => {
    // Select the first leaderboard by default once loaded
    if (leaderboards && leaderboards.length > 0 && !selectedLeaderboard) {
      setSelectedLeaderboard(leaderboards[0].id);
    }
  }, [leaderboards]);

  useEffect(() => {
    if (selectedLeaderboard) {
      fetchLeaderboardEntries(selectedLeaderboard);
    }
  }, [selectedLeaderboard, period]);

  const handleLeaderboardSelect = (id: string) => {
    setSelectedLeaderboard(id);
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };

  const getLeaderboardById = (id: string): Leaderboard | undefined => {
    return leaderboards?.find(lb => lb.id === id);
  };

  const renderLeaderboardTabs = () => {
    if (!leaderboards || leaderboards.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2">{t('leaderboards.noLeaderboards')}</h3>
          <p>{t('leaderboards.checkBackSoon')}</p>
        </div>
      );
    }

    const groupedLeaderboards: Record<string, Leaderboard[]> = {};
    
    leaderboards.forEach(leaderboard => {
      if (!groupedLeaderboards[leaderboard.category]) {
        groupedLeaderboards[leaderboard.category] = [];
      }
      groupedLeaderboards[leaderboard.category].push(leaderboard);
    });

    return (
      <Tabs defaultValue={Object.keys(groupedLeaderboards)[0]} className="mt-6">
        <TabsList className="mb-4">
          {Object.keys(groupedLeaderboards).map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.entries(groupedLeaderboards).map(([category, boards]) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map(leaderboard => (
                <Card 
                  key={leaderboard.id}
                  className={`hover:border-emerald/50 transition-all cursor-pointer ${
                    selectedLeaderboard === leaderboard.id ? 'bg-emerald/5 border-emerald/50' : ''
                  }`}
                  onClick={() => handleLeaderboardSelect(leaderboard.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle>{leaderboard.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {leaderboard.description}
                    </p>
                    <div className="flex items-center mt-4 text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{leaderboardEntries.filter(e => e.leaderboard_id === leaderboard.id).length} {t('leaderboards.players')}</span>
                      
                      {leaderboard.prize_pool > 0 && (
                        <div className="ml-4 flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-amber-400" />
                          <span>{leaderboard.prize_pool} {t('common.chips')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  const renderLeaderboardEntries = () => {
    if (!selectedLeaderboard) return null;
    
    const currentLeaderboard = getLeaderboardById(selectedLeaderboard);
    if (!currentLeaderboard) return null;
    
    const filteredEntries = leaderboardEntries
      .filter(entry => entry.leaderboard_id === selectedLeaderboard)
      .sort((a, b) => a.rank! - b.rank!);
    
    // Find user's entry
    const userEntry = user ? filteredEntries.find(entry => entry.player_id === user.id) : null;
    
    return (
      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold">{currentLeaderboard.name}</h2>
            <p className="text-muted-foreground">{currentLeaderboard.description}</p>
          </div>
          
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('leaderboards.selectPeriod')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{t('leaderboards.daily')}</SelectItem>
              <SelectItem value="weekly">{t('leaderboards.weekly')}</SelectItem>
              <SelectItem value="monthly">{t('leaderboards.monthly')}</SelectItem>
              <SelectItem value="allTime">{t('leaderboards.allTime')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-navy/30 animate-pulse rounded-md" />
            ))}
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="space-y-1">
            <div className="top-three flex flex-col md:flex-row gap-2 mb-6">
              {filteredEntries.slice(0, 3).map((entry, index) => {
                const position = index + 1;
                return (
                  <Card key={entry.id} className={`flex-1 ${position === 1 ? 'bg-amber-500/10' : position === 2 ? 'bg-slate-300/10' : 'bg-amber-700/10'}`}>
                    <CardContent className="pt-6 flex items-center">
                      <div className="p-2 rounded-full bg-navy/30 mr-4">
                        {position === 1 ? (
                          <Trophy className="h-8 w-8 text-amber-400" />
                        ) : position === 2 ? (
                          <MedalFirst className="h-8 w-8 text-slate-300" />
                        ) : (
                          <MedalSecond className="h-8 w-8 text-amber-700" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{entry.player_name?.substring(0, 2) || '??'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{entry.player_name || 'Unknown Player'}</div>
                            <div className="text-sm text-muted-foreground">
                              {t('leaderboards.score')}: {entry.score}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {filteredEntries.slice(3).map((entry) => (
              <div 
                key={entry.id} 
                className={`flex items-center p-3 rounded-md ${
                  entry.player_id === user?.id ? 'bg-emerald/10 border border-emerald/30' : 'bg-navy/20'
                }`}
              >
                <div className="w-8 text-center font-medium mr-2">
                  #{entry.rank}
                </div>
                <Avatar className="h-8 w-8 mr-4">
                  <AvatarFallback>{entry.player_name?.substring(0, 2) || '??'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{entry.player_name || 'Unknown Player'}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{entry.score}</div>
                  <div className="text-xs text-muted-foreground">
                    {t('leaderboards.points')}
                  </div>
                </div>
              </div>
            ))}
            
            {userEntry && userEntry.rank! > 10 && (
              <>
                <div className="my-2 text-center text-muted-foreground text-sm">
                  • • •
                </div>
                
                <div className="flex items-center p-3 rounded-md bg-emerald/10 border border-emerald/30">
                  <div className="w-8 text-center font-medium mr-2">
                    #{userEntry.rank}
                  </div>
                  <Avatar className="h-8 w-8 mr-4">
                    <AvatarFallback>{userEntry.player_name?.substring(0, 2) || '??'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{userEntry.player_name || 'You'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{userEntry.score}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('leaderboards.points')}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-md">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">{t('leaderboards.noEntries')}</h3>
            <p className="text-muted-foreground mb-4">{t('leaderboards.beTheFirst')}</p>
            <Button variant="outline">{t('leaderboards.participate')}</Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container py-6 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('leaderboards.title')}</h1>
          <p className="text-muted-foreground">{t('leaderboards.description')}</p>
        </div>
      </div>
      
      {renderLeaderboardTabs()}
      {renderLeaderboardEntries()}
    </div>
  );
}

export default LeaderboardsPage;
