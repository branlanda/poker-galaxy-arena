import React, { useState, useEffect } from 'react';
import { useLeaderboards } from '@/hooks/useLeaderboards';
import { Leaderboard } from '@/types/gamification';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Trophy, Medal, Award, Star, SearchIcon, Users, Globe 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const LeaderboardsPage = () => {
  const { leaderboards, leaderboardEntries, loading, fetchLeaderboardEntries } = useLeaderboards();
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  
  // Set initial leaderboard on mount
  useEffect(() => {
    if (leaderboards.length > 0 && !selectedLeaderboard) {
      setSelectedLeaderboard(leaderboards[0].id);
    }
  }, [leaderboards, selectedLeaderboard]);
  
  // Fetch leaderboard entries when selected leaderboard changes
  useEffect(() => {
    if (selectedLeaderboard) {
      fetchLeaderboardEntries(selectedLeaderboard);
    }
  }, [selectedLeaderboard, fetchLeaderboardEntries]);
  
  // Filter leaderboard entries based on search query
  const filteredEntries = leaderboardEntries.filter(entry =>
    entry.player_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('leaderboards.title')}</h1>
          <p className="text-muted-foreground">{t('leaderboards.description')}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-muted-foreground" />
            {t('leaderboards.selectCategory')}
          </CardTitle>
          <CardDescription>
            {t('leaderboards.browseDifferentCategories')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={leaderboards.length > 0 ? leaderboards[0].id : 'default'} className="w-full">
            <TabsList>
              {leaderboards.map(leaderboard => (
                <TabsTrigger 
                  key={leaderboard.id} 
                  value={leaderboard.id}
                  onClick={() => setSelectedLeaderboard(leaderboard.id)}
                >
                  {leaderboard.category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {leaderboards.map(leaderboard => (
              <TabsContent key={leaderboard.id} value={leaderboard.id}>
                <div className="mb-4">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('search')}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredEntries.length > 0 ? (
                  <div className="space-y-4">
                    {filteredEntries.map((entry, index) => (
                      <Card key={entry.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="mr-2 h-8 w-8">
                                <AvatarImage src={`https://avatar.vercel.sh/${entry.player_name}.png`} alt={entry.player_name} />
                                <AvatarFallback>{entry.player_name?.[0] || '?'}</AvatarFallback>
                              </Avatar>
                              {entry.player_name}
                            </div>
                            <Badge variant="secondary">
                              {t('leaderboards.rank')} #{entry.rank}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {t('leaderboards.score')}
                              </p>
                              <p className="font-medium">{entry.score}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {t('leaderboards.dateAchieved')}
                              </p>
                              <p className="font-medium">
                                {new Date(entry.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    {t('leaderboards.noEntries')}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {t('leaderboards.updatedRealtime')}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
