
import React, { useState } from 'react';
import { useLeaderboards } from '@/hooks/useLeaderboards';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, Award, Star, Users, Calendar, Search, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppLayout } from '@/components/layout/AppLayout';

const LeaderboardsPage = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedCategory, setSelectedCategory] = useState('total_winnings');
  const [searchQuery, setSearchQuery] = useState('');

  const { leaderboardEntries, loading, fetchLeaderboardEntries } = useLeaderboards();

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const filteredLeaderboards = leaderboardEntries?.filter(player =>
    player.player_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 2:
        return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
      case 3:
        return 'bg-amber-600/20 text-amber-600 border-amber-600/30';
      default:
        return 'bg-emerald/20 text-emerald border-emerald/30';
    }
  };

  const categories = [
    { value: 'total_winnings', label: 'Total Winnings' },
    { value: 'games_won', label: 'Games Won' },
    { value: 'tournament_wins', label: 'Tournament Wins' },
    { value: 'biggest_pot', label: 'Biggest Pot' },
  ];

  const periods = [
    { value: 'daily', label: t('leaderboards.daily', 'Daily') },
    { value: 'weekly', label: t('leaderboards.weekly', 'Weekly') },
    { value: 'monthly', label: t('leaderboards.monthly', 'Monthly') },
    { value: 'allTime', label: t('leaderboards.allTime', 'All Time') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              {t('leaderboards.title', 'Leaderboards')}
            </h1>
            <p className="text-gray-400">
              {t('leaderboards.description', 'See who\'s at the top of the rankings')}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px] bg-slate-800/60 border-emerald/20 text-white">
                  <SelectValue placeholder={t('leaderboards.selectPeriod', 'Select Period')} />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: 'daily', label: t('leaderboards.daily', 'Daily') },
                    { value: 'weekly', label: t('leaderboards.weekly', 'Weekly') },
                    { value: 'monthly', label: t('leaderboards.monthly', 'Monthly') },
                    { value: 'allTime', label: t('leaderboards.allTime', 'All Time') },
                  ].map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] bg-slate-800/60 border-emerald/20 text-white">
                  <SelectValue placeholder={t('leaderboards.selectCategory', 'Leaderboard Categories')} />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: 'total_winnings', label: 'Total Winnings' },
                    { value: 'games_won', label: 'Games Won' },
                    { value: 'tournament_wins', label: 'Tournament Wins' },
                    { value: 'biggest_pot', label: 'Biggest Pot' },
                  ].map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 bg-slate-800/60 border-emerald/20 text-white placeholder-gray-400 w-64"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-emerald/10"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Leaderboards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-slate-800/70 rounded-lg animate-pulse border border-emerald/10" />
              ))}
            </div>
          ) : (leaderboardEntries?.filter(player =>
            player.player_name?.toLowerCase().includes(searchQuery.toLowerCase())
          ) || []).length === 0 ? (
            <div className="text-center py-12 bg-slate-800/70 rounded-lg border border-emerald/20">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery 
                  ? t('leaderboards.noSearchResults', 'No players match your search criteria.')
                  : t('leaderboards.noEntries', 'No Entries Yet')}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery 
                  ? t('leaderboards.clearSearch', 'Clear Search')
                  : t('leaderboards.noPlayersYet', 'No players have been ranked in this category yet.')}
              </p>
              {searchQuery ? (
                <Button onClick={() => setSearchQuery('')} variant="outline" className="bg-slate-800/60 border-emerald/20 hover:bg-slate-700/50 text-white">
                  {t('leaderboards.clearSearch', 'Clear Search')}
                </Button>
              ) : (
                <p className="text-gray-400">
                  {t('leaderboards.beTheFirst', 'Be the first to participate and claim the top spot')}
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(leaderboardEntries?.filter(player =>
                player.player_name?.toLowerCase().includes(searchQuery.toLowerCase())
              ) || []).map((player, index) => {
                const rank = index + 1;
                const getRankIcon = (rank: number) => {
                  switch (rank) {
                    case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
                    case 2: return <Medal className="h-5 w-5 text-gray-400" />;
                    case 3: return <Award className="h-5 w-5 text-amber-600" />;
                    default: return <span className="text-sm font-bold text-gray-400">#{rank}</span>;
                  }
                };
                const getRankBadgeColor = (rank: number) => {
                  switch (rank) {
                    case 1: return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
                    case 2: return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
                    case 3: return 'bg-amber-600/20 text-amber-600 border-amber-600/30';
                    default: return 'bg-emerald/20 text-emerald border-emerald/30';
                  }
                };
                return (
                  <Card 
                    key={player.id || player.player_id} 
                    className={`bg-slate-800/70 border-emerald/20 hover:border-emerald/40 transition-colors ${
                      rank <= 3 ? 'ring-2 ring-emerald/20' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getRankIcon(rank)}
                          <div>
                            <CardTitle className="text-white text-lg">
                              {player.player_name}
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              {t('leaderboards.dateAchieved', 'Achieved')}: {new Date(player.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getRankBadgeColor(rank)}>
                          #{rank}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">
                            {t('leaderboards.score', 'Score')}
                          </p>
                          <p className="text-2xl font-bold text-emerald">
                            {player.score} {t('leaderboards.points', 'points')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={player.player_avatar} />
                            <AvatarFallback className="bg-emerald/20 text-emerald">
                              {player.player_name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </AppLayout>
    </div>
  );
};

export default LeaderboardsPage;
