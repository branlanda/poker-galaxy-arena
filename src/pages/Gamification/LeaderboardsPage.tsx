
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Award,
  Search,
  Calendar,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLeaderboards } from '@/hooks/useLeaderboards';

const LeaderboardsPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    leaderboards, 
    leaderboardEntries, 
    loading, 
    fetchLeaderboards, 
    fetchLeaderboardEntries 
  } = useLeaderboards();
  
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  useEffect(() => {
    if (leaderboards.length > 0 && !selectedLeaderboard) {
      setSelectedLeaderboard(leaderboards[0].id);
    }
  }, [leaderboards, selectedLeaderboard]);

  useEffect(() => {
    if (selectedLeaderboard) {
      fetchLeaderboardEntries(selectedLeaderboard);
    }
  }, [selectedLeaderboard, fetchLeaderboardEntries]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-gold" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const filteredEntries = leaderboardEntries.filter(entry =>
    entry.player_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && leaderboards.length === 0) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-t-emerald rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald mb-4">
            {t('leaderboards.title', 'Leaderboards')}
          </h1>
          <p className="text-xl text-gray-400">
            {t('leaderboards.description', 'See who\'s at the top of the rankings')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('daily')}
            >
              {t('leaderboards.daily', 'Daily')}
            </Button>
            <Button
              variant={selectedPeriod === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('weekly')}
            >
              {t('leaderboards.weekly', 'Weekly')}
            </Button>
            <Button
              variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('monthly')}
            >
              {t('leaderboards.monthly', 'Monthly')}
            </Button>
            <Button
              variant={selectedPeriod === 'allTime' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('allTime')}
            >
              {t('leaderboards.allTime', 'All Time')}
            </Button>
          </div>
        </div>

        {leaderboards.length > 0 ? (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Leaderboard Categories */}
            <div className="lg:col-span-1">
              <Card className="bg-navy/50 border-emerald/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-emerald" />
                    {t('leaderboards.selectCategory', 'Leaderboard Categories')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {leaderboards.map((leaderboard) => (
                    <Button
                      key={leaderboard.id}
                      variant={selectedLeaderboard === leaderboard.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedLeaderboard(leaderboard.id)}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      {leaderboard.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard Content */}
            <div className="lg:col-span-3">
              {filteredEntries.length > 0 ? (
                <Card className="bg-navy/50 border-emerald/20">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {leaderboards.find(l => l.id === selectedLeaderboard)?.name} Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredEntries.map((entry, index) => (
                        <div
                          key={entry.id}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                            entry.rank <= 3 
                              ? 'bg-gradient-to-r from-emerald/10 to-gold/10 border-emerald/30' 
                              : 'bg-navy border-gray-600 hover:border-emerald/30'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12">
                              {getRankIcon(entry.rank)}
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-white">{entry.player_name}</h3>
                              <p className="text-sm text-gray-400">
                                {t('leaderboards.score', 'Score')}: {entry.score}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <Badge 
                              variant={entry.rank <= 3 ? 'default' : 'secondary'}
                              className={entry.rank <= 3 ? 'bg-emerald' : ''}
                            >
                              {entry.score} {t('leaderboards.points', 'points')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-navy/50 border-gray-600">
                  <CardContent className="p-12 text-center">
                    <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {searchQuery ? 'No Search Results' : t('leaderboards.noEntries', 'No Entries Yet')}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {searchQuery 
                        ? 'No players match your search criteria.' 
                        : t('leaderboards.beTheFirst', 'Be the first to participate and claim the top spot')
                      }
                    </p>
                    {searchQuery && (
                      <Button variant="outline" onClick={() => setSearchQuery('')}>
                        Clear Search
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <Card className="bg-navy/50 border-gray-600">
            <CardContent className="p-12 text-center">
              <Trophy className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('leaderboards.noLeaderboards', 'No Leaderboards Available')}
              </h3>
              <p className="text-gray-400">
                {t('leaderboards.checkBackSoon', 'Check back soon for new competitions')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default LeaderboardsPage;
