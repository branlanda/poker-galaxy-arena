
import { useEffect, useState } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Achievement, 
  PlayerAchievement, 
  PlayerLevel
} from '@/types/gamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Award, Trophy, Star, Users } from 'lucide-react';
import { AchievementsSection } from '@/components/profile/AchievementsSection';

export function AchievementsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [achievements, setAchievements] = useState<PlayerAchievement[]>([]);
  const [playerLevel, setPlayerLevel] = useState<PlayerLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    if (!user) return;
    
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        // Fetch player achievements with achievement details
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('player_achievements')
          .select(`
            *,
            achievement:achievement_id (
              id, name, description, icon_url, category, points
            )
          `)
          .eq('player_id', user.id);
          
        if (achievementsError) throw achievementsError;
        
        // Fetch player level information
        const { data: levelData, error: levelError } = await supabase
          .from('player_levels')
          .select(`
            *,
            level_definition:current_level (
              level, xp_required, title, rewards
            )
          `)
          .eq('player_id', user.id)
          .single();
          
        if (levelError && levelError.code !== 'PGRST116') {
          throw levelError;
        }
        
        setAchievements(achievementsData || []);
        setPlayerLevel(levelData || null);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        toast({
          title: t('errors.fetchFailed'),
          description: t('profile.achievementsFetchError'),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, [user]);
  
  const getProgressToNextLevel = () => {
    if (!playerLevel || !playerLevel.level_definition) return 0;
    
    const currentLevelXP = playerLevel.current_xp;
    const nextLevelXP = playerLevel.level_definition.xp_required;
    
    if (nextLevelXP <= 0) return 100;
    return (currentLevelXP / nextLevelXP) * 100;
  };
  
  // Filter achievements by category based on active tab
  const filteredAchievements = achievements.filter(achievement => {
    if (activeTab === 'all') return true;
    return achievement.achievement?.category === activeTab;
  });
  
  // Get unique categories from achievements
  const categories = [...new Set(achievements.map(a => a.achievement?.category).filter(Boolean))];
  
  const completedCount = achievements.filter(a => a.completed).length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">{t('achievements.title')}</h1>
          <p className="mb-4">{t('achievements.loginRequired')}</p>
          <a href="/login" className="text-emerald hover:underline">
            {t('login')}
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('achievements.title')}</h1>
          <p className="text-muted-foreground">{t('achievements.description')}</p>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-navy/70 rounded-md animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Player Level Card */}
            <Card className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('profile.level')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">
                    {t('profile.levelNumber', { level: playerLevel?.current_level || 1 })}
                  </h3>
                  <Award className="h-6 w-6 text-emerald" />
                </div>
                
                {playerLevel?.level_definition?.title && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {playerLevel.level_definition.title}
                  </p>
                )}
                
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>{t('profile.xpToNextLevel')}</span>
                    <span>
                      {playerLevel?.current_xp || 0} / 
                      {playerLevel?.level_definition?.xp_required || 1000} XP
                    </span>
                  </div>
                  <Progress value={getProgressToNextLevel()} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
            
            {/* Achievements Progress Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('achievements.progress')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">
                    {completedCount} / {totalCount}
                  </h3>
                  <Trophy className="h-6 w-6 text-emerald" />
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {t('achievements.completed', { percentage: completionPercentage.toFixed(0) })}
                </p>
                
                <div className="mt-4">
                  <Progress value={completionPercentage} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
            
            {/* Total Points Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('achievements.points')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">
                    {achievements.reduce((sum, a) => sum + (a.completed ? (a.achievement?.points || 0) : 0), 0)}
                  </h3>
                  <Star className="h-6 w-6 text-emerald" />
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  {t('achievements.earnedPoints')}
                </p>
              </CardContent>
            </Card>
            
            {/* Next Achievement Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('achievements.nextMilestone')}</CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.some(a => !a.completed) ? (
                  achievements
                    .filter(a => !a.completed)
                    .sort((a, b) => b.progress - a.progress)
                    .slice(0, 1)
                    .map(achievement => (
                      <div key={achievement.id}>
                        <p className="font-medium mb-1">{achievement.achievement?.name}</p>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>{t('progress')}</span>
                          <span>
                            {Math.round(achievement.progress * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={achievement.progress * 100}
                          className="h-1.5"
                        />
                      </div>
                    ))
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{t('achievements.allCompleted')}</p>
                    <Users className="h-6 w-6 text-emerald" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">{t('all')}</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          <AchievementsSection 
            achievements={filteredAchievements} 
            loading={false} 
          />
        </>
      )}
    </div>
  );
}
