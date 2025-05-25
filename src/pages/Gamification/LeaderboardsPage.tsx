import React, { useState, useEffect } from 'react';
import { useLeaderboards } from '@/hooks/useLeaderboards';
import { useTournamentStats } from '@/hooks/useTournamentStats';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Medal, Award, Star, SearchIcon, Users, Globe, ArrowLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

export const LeaderboardsPage = () => {
  const { leaderboards, leaderboardEntries, loading, fetchLeaderboardEntries } = useLeaderboards();
  const { getLeaderboard } = useTournamentStats();
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [tournamentLeaderboard, setTournamentLeaderboard] = useState<any[]>([]);
  const [tournamentTimeframe, setTournamentTimeframe] = useState<'week' | 'month' | 'all'>('all');
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

  // Fetch tournament leaderboard
  useEffect(() => {
    const loadTournamentLeaderboard = async () => {
      const data = await getLeaderboard(tournamentTimeframe);
      setTournamentLeaderboard(data);
    };
    loadTournamentLeaderboard();
  }, [tournamentTimeframe, getLeaderboard]);
  
  // Filter leaderboard entries based on search query
  const filteredEntries = leaderboardEntries.filter(entry =>
    entry.player_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTournamentEntries = tournamentLeaderboard.filter(entry =>
    entry.profiles?.alias?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <Star className="h-5 w-5 text-gray-500" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    if (rank === 2) return "bg-gray-400/20 text-gray-400 border-gray-400/30";
    if (rank === 3) return "bg-amber-600/20 text-amber-600 border-amber-600/30";
    return "bg-emerald/20 text-emerald border-emerald/30";
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.welcome', 'Back to Home')}
            </Link>
          </Button>
          <div className="h-6 w-px bg-gray-600"></div>
          <div>
            <h1 className="text-3xl font-bold text-emerald">{t('leaderboards.title', 'Leaderboards')}</h1>
            <p className="text-gray-400">{t('leaderboards.description', 'See how you rank against other players')}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Link to="/lobby" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {t('lobby.title', 'Lobby')}
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Link to="/tournaments" className="flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              {t('tournaments.lobby', 'Tournaments')}
            </Link>
          </Button>
        </div>
      </div>
      
      <Card className="bg-navy/50 border-emerald/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Globe className="h-5 w-5 mr-2 text-emerald" />
            {t('leaderboards.selectCategory', 'Leaderboard Categories')}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t('leaderboards.browseDifferentCategories', 'Browse different leaderboard categories and compete with other players')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tournaments" className="w-full">
            <TabsList className="grid w-full grid-cols-auto bg-navy/60 border border-emerald/20">
              <TabsTrigger 
                value="tournaments"
                className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald text-gray-300"
              >
                {t('leaderboards.tournaments', 'Tournaments')}
              </TabsTrigger>
              {leaderboards.map(leaderboard => (
                <TabsTrigger 
                  key={leaderboard.id} 
                  value={leaderboard.id}
                  onClick={() => setSelectedLeaderboard(leaderboard.id)}
                  className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald text-gray-300"
                >
                  {leaderboard.category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Search Bar */}
            <div className="mt-6 mb-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('common.search', 'Search players...')}
                  className="pl-10 bg-navy/60 border-emerald/20 text-white placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Tournament Leaderboard */}
            <TabsContent value="tournaments">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">{t('leaderboards.tournamentLeaders', 'Tournament Leaders')}</h3>
                  <div className="flex gap-2">
                    {(['week', 'month', 'all'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setTournamentTimeframe(period)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          tournamentTimeframe === period 
                            ? 'bg-emerald/20 text-emerald' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {filteredTournamentEntries.length > 0 ? (
                  <div className="space-y-2">
                    {filteredTournamentEntries.map((entry, index) => (
                      <Card key={entry.id} className="bg-navy/30 border-emerald/10 hover:border-emerald/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center gap-2">
                                {getRankIcon(index + 1)}
                                <Badge className={`px-2 py-1 font-bold ${getRankColor(index + 1)}`}>
                                  #{index + 1}
                                </Badge>
                              </div>
                              
                              <Avatar className="h-10 w-10 border-2 border-emerald/20">
                                <AvatarImage 
                                  src={entry.profiles?.avatar_url || `https://avatar.vercel.sh/${entry.profiles?.alias}.png`} 
                                  alt={entry.profiles?.alias} 
                                />
                                <AvatarFallback className="bg-emerald/20 text-emerald">
                                  {entry.profiles?.alias?.[0] || '?'}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div>
                                <h3 className="font-semibold text-white">{entry.profiles?.alias || 'Anonymous'}</h3>
                                <p className="text-sm text-gray-400">
                                  {entry.tournaments_played} tournaments • {entry.tournaments_won} wins
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-xl font-bold text-emerald">{entry.roi?.toFixed(1)}% ROI</div>
                              <p className="text-sm text-gray-400">${entry.total_prize_money}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t('leaderboards.noTournamentEntries', 'No Tournament Players Found')}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {searchQuery 
                        ? t('leaderboards.noSearchResults', 'No players match your search criteria.')
                        : t('leaderboards.noTournamentPlayersYet', 'No players have competed in tournaments yet.')
                      }
                    </p>
                    {searchQuery && (
                      <Button variant="outline" onClick={() => setSearchQuery('')}>
                        {t('leaderboards.clearSearch', 'Clear Search')}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Other Leaderboards */}
            {leaderboards.map(leaderboard => (
              <TabsContent key={leaderboard.id} value={leaderboard.id}>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 bg-navy/30 rounded-lg">
                        <Skeleton className="h-12 w-12 rounded-full bg-gray-600" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[250px] bg-gray-600" />
                          <Skeleton className="h-4 w-[200px] bg-gray-600" />
                        </div>
                        <Skeleton className="h-8 w-16 bg-gray-600" />
                      </div>
                    ))}
                  </div>
                ) : filteredEntries.length > 0 ? (
                  <div className="space-y-2">
                    {filteredEntries.map((entry, index) => (
                      <Card key={entry.id} className="bg-navy/30 border-emerald/10 hover:border-emerald/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center gap-2">
                                {getRankIcon(entry.rank)}
                                <Badge className={`px-2 py-1 font-bold ${getRankColor(entry.rank)}`}>
                                  #{entry.rank}
                                </Badge>
                              </div>
                              
                              <Avatar className="h-10 w-10 border-2 border-emerald/20">
                                <AvatarImage 
                                  src={`https://avatar.vercel.sh/${entry.player_name}.png`} 
                                  alt={entry.player_name} 
                                />
                                <AvatarFallback className="bg-emerald/20 text-emerald">
                                  {entry.player_name?.[0] || '?'}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div>
                                <h3 className="font-semibold text-white">{entry.player_name}</h3>
                                <p className="text-sm text-gray-400">
                                  {t('leaderboards.dateAchieved', 'Achieved')}: {new Date(entry.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-emerald">{entry.score}</div>
                              <p className="text-sm text-gray-400">{t('leaderboards.score', 'points')}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t('leaderboards.noEntries', 'No Players Found')}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {searchQuery 
                        ? t('leaderboards.noSearchResults', 'No players match your search criteria.')
                        : t('leaderboards.noPlayersYet', 'No players have been ranked in this category yet.')
                      }
                    </p>
                    {searchQuery && (
                      <Button variant="outline" onClick={() => setSearchQuery('')}>
                        {t('leaderboards.clearSearch', 'Clear Search')}
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
