import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { Leaderboard, LeaderboardEntry } from '@/types/gamification';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Medal, Trophy, Award } from 'lucide-react';

export function LeaderboardsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<string | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('leaderboards')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setLeaderboards(data || []);
        
        if (data && data.length > 0) {
          setSelectedLeaderboard(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching leaderboards:', err);
        toast({
          title: t('errors.fetchFailed'),
          description: t('leaderboards.fetchError'),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboards();
  }, []);
  
  useEffect(() => {
    if (!selectedLeaderboard) return;
    
    const fetchEntries = async () => {
      try {
        // Fetch leaderboard entries with player information
        const { data, error } = await supabase
          .from('leaderboard_entries')
          .select(`
            *,
            players (
              alias,
              avatar_url
            )
          `)
          .eq('leaderboard_id', selectedLeaderboard)
          .order('rank', { ascending: true });
          
        if (error) throw error;
        
        const formattedEntries = data.map(entry => {
          // Safely handle the join results
          const playerData = entry.players || {};
          return {
            ...entry,
            player_name: playerData.alias || 'Unknown Player',
            player_avatar: playerData.avatar_url || null
          };
        });
        
        setEntries(formattedEntries);
        
        // Find user's rank if they are authenticated
        if (user) {
          const userEntry = formattedEntries.find(entry => entry.player_id === user.id);
          setUserRank(userEntry || null);
        }
      } catch (err) {
        console.error('Error fetching leaderboard entries:', err);
        toast({
          title: t('errors.fetchFailed'),
          description: t('leaderboards.entriesFetchError'),
          variant: 'destructive',
        });
      }
    };
    
    fetchEntries();
  }, [selectedLeaderboard, user]);
  
  // Filter leaderboards by category
  const filteredLeaderboards = leaderboards.filter(leaderboard => {
    if (activeCategory === 'all') return true;
    return leaderboard.category === activeCategory;
  });
  
  // Get unique categories from leaderboards
  const categories = [...new Set(leaderboards.map(l => l.category))];
  
  // Get the currently selected leaderboard details
  const currentLeaderboard = leaderboards.find(l => l.id === selectedLeaderboard);
  
  const getMedalComponent = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return null;
  };
  
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Replace the user_metadata usage
  const getUserDisplayName = () => {
    if (!user) return 'You';
    // Use user.user_metadata if it exists, otherwise use a default or email
    return user.email?.split('@')[0] || 'Player';
  };
  
  // Modify the user rank display to use our new helper function
  const renderUserRank = () => {
    if (!userRank) return null;
    
    return (
      <div className="mt-6 p-3 border rounded bg-muted/30">
        <p className="text-sm font-medium mb-2">{t('leaderboards.yourRank')}</p>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center mr-2">
            <span className="text-sm font-bold">#{userRank.rank || '?'}</span>
          </div>
          <div>
            <p className="font-medium">{getUserDisplayName()}</p>
            <p className="text-xs text-muted-foreground">
              {t('leaderboards.points', { count: Math.round(userRank.score) })}
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('leaderboards.title')}</h1>
          <p className="text-muted-foreground">{t('leaderboards.description')}</p>
        </div>
      </div>
      
      {loading && leaderboards.length === 0 ? (
        <div className="space-y-4">
          <div className="h-12 bg-navy/70 rounded-md animate-pulse"></div>
          <div className="h-64 bg-navy/70 rounded-md animate-pulse"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{t('leaderboards.categories')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs 
                    orientation="vertical" 
                    value={activeCategory} 
                    onValueChange={setActiveCategory}
                    className="space-y-1"
                  >
                    <TabsList className="flex flex-col h-auto space-y-1">
                      <TabsTrigger value="all" className="justify-start">
                        {t('all')}
                      </TabsTrigger>
                      {categories.map(category => (
                        <TabsTrigger key={category} value={category} className="justify-start">
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  
                  {renderUserRank()}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              {filteredLeaderboards.length > 0 ? (
                <Card>
                  <CardHeader className="space-y-0 pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <CardTitle>{t('leaderboards.rankings')}</CardTitle>
                        <CardDescription>
                          {currentLeaderboard?.description || t('leaderboards.competitionDesc')}
                        </CardDescription>
                      </div>
                      
                      {filteredLeaderboards.length > 1 && (
                        <div className="w-full md:w-64">
                          <Select 
                            value={selectedLeaderboard || undefined}
                            onValueChange={(value) => setSelectedLeaderboard(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('leaderboards.selectLeaderboard')} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredLeaderboards.map(leaderboard => (
                                <SelectItem key={leaderboard.id} value={leaderboard.id}>
                                  {leaderboard.name} - {leaderboard.period}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    
                    {currentLeaderboard?.prize_pool && currentLeaderboard.prize_pool > 0 && (
                      <div className="mt-2 flex items-center text-sm">
                        <Trophy className="h-4 w-4 mr-1 text-emerald" />
                        <span>
                          {t('leaderboards.prizePool')}: {currentLeaderboard.prize_pool} USDT
                        </span>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    {entries.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">{t('leaderboards.rank')}</TableHead>
                              <TableHead>{t('player')}</TableHead>
                              <TableHead className="text-right">{t('leaderboards.score')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {entries.map(entry => (
                              <TableRow key={entry.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <span className="w-6 text-right">{entry.rank}</span>
                                    <div className="ml-2">
                                      {getMedalComponent(entry.rank || 0)}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      {entry.player_avatar ? (
                                        <AvatarImage src={entry.player_avatar} alt={entry.player_name || ''} />
                                      ) : null}
                                      <AvatarFallback>
                                        {getInitials(entry.player_name || '')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className={entry.player_id === user?.id ? 'font-bold text-emerald' : ''}>
                                      {entry.player_name || 'Unknown Player'}
                                      {entry.player_id === user?.id && ` (${t('you')})`}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  {Math.round(entry.score).toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-lg font-medium">{t('leaderboards.noEntriesYet')}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('leaderboards.playToCompete')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10 p-6">
                  <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">{t('leaderboards.noLeaderboardsFound')}</h3>
                  <p className="text-center text-muted-foreground">
                    {t('leaderboards.checkBackSoon')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
