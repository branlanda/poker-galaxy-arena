
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAchievements } from '@/hooks/useAchievements';
import { PlayerAchievement, PlayerLevel } from '@/types/gamification';
import { AchievementsSection } from '@/components/profile/AchievementsSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/stores/auth';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, Star, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AchievementsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { achievements, playerAchievements, loading: achievementsLoading, refreshAchievements } = useAchievements();
  const [playerLevel, setPlayerLevel] = useState<PlayerLevel | null>(null);
  const [activeMissions, setActiveMissions] = useState<any[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);

  useEffect(() => {
    if (user) {
      refreshAchievements();
      fetchPlayerLevel();
      fetchActiveMissions();
    }
  }, [user]);

  const fetchPlayerLevel = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('player_levels')
        .select('*, level_definition:level_definitions(*)')
        .eq('player_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching player level:', error);
        return;
      }
      
      if (data) {
        setPlayerLevel(data);
      } else {
        // If no level data found, fetch the level 1 definition
        const { data: levelDef } = await supabase
          .from('level_definitions')
          .select('*')
          .eq('level', 1)
          .single();
          
        setPlayerLevel({
          id: 'new',
          player_id: user.id,
          current_level: 1,
          current_xp: 0,
          total_xp_earned: 0,
          updated_at: new Date().toISOString(),
          level_definition: levelDef || null
        });
      }
    } catch (err) {
      console.error('Error in fetchPlayerLevel:', err);
    }
  };

  const fetchActiveMissions = async () => {
    if (!user) return;
    
    setLoadingMissions(true);
    
    try {
      const { data, error } = await supabase
        .from('player_missions')
        .select(`
          id,
          player_id,
          mission_id,
          progress,
          completed_at,
          expires_at,
          daily_missions (
            id,
            name,
            description,
            reward_xp,
            reward_chips,
            requirements
          )
        `)
        .eq('player_id', user.id)
        .is('completed_at', null)
        .gte('expires_at', new Date().toISOString());
      
      if (error) {
        console.error('Error fetching missions:', error);
        return;
      }
      
      setActiveMissions(data || []);
    } catch (err) {
      console.error('Error in fetchActiveMissions:', err);
    } finally {
      setLoadingMissions(false);
    }
  };

  // Calculate XP progress percentage to next level
  const calculateProgress = (): number => {
    if (!playerLevel || !playerLevel.level_definition) return 0;
    
    const currentLevel = playerLevel.current_level;
    const nextLevelXp = playerLevel.level_definition.xp_required;
    const prevLevelXp = currentLevel > 1 ? 
      (playerLevel.level_definition.xp_required - (nextLevelXp * 0.75)) : 0;
    
    const currentLevelProgress = playerLevel.current_xp - prevLevelXp;
    const levelRange = nextLevelXp - prevLevelXp;
    
    return Math.min(100, Math.max(0, (currentLevelProgress / levelRange) * 100));
  };

  const completedAchievementsCount = playerAchievements?.filter(a => a.completed).length || 0;
  const totalAchievementsCount = achievements?.length || 0;
  
  const renderLevelCard = () => {
    if (!playerLevel) {
      return (
        <Card className="bg-navy/20 border-navy/50">
          <CardContent className="pt-6 text-center">
            <div className="h-4 w-32 bg-navy/30 rounded-md mx-auto animate-pulse"></div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card className="bg-gradient-to-r from-emerald/10 to-blue-500/10 border-emerald/20">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-amber-400" />
              <span className="text-xl font-bold">{t('achievements.level')} {playerLevel.current_level}</span>
            </div>
            <Badge variant="outline" className="bg-emerald/20 text-emerald border-emerald/40">
              {playerLevel.level_definition?.title || `${t('achievements.level')} ${playerLevel.current_level}`}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('achievements.currentXP')}: {playerLevel.current_xp} XP</span>
              <span>
                {playerLevel.level_definition?.xp_required} XP {t('achievements.toNextLevel')}
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2 bg-navy/50" />
            
            <div className="mt-4 text-sm text-muted-foreground">
              {t('achievements.totalXP')}: {playerLevel.total_xp_earned} XP
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMissionsCard = () => {
    if (loadingMissions) {
      return (
        <Card className="bg-navy/20 border-navy/50 h-64">
          <CardHeader>
            <CardTitle>{t('achievements.dailyMissions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-navy/30 rounded-md animate-pulse" />
            ))}
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card className="bg-navy/20 border-navy/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald" />
            {t('achievements.dailyMissions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeMissions.length > 0 ? (
            <div className="space-y-4">
              {activeMissions.map(mission => {
                const missionData = mission.daily_missions;
                if (!missionData) return null;
                
                return (
                  <div key={mission.id} className="border border-navy/50 rounded-md p-3 bg-navy/30">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{missionData.name}</h4>
                      <Badge variant="outline" className="bg-emerald/10 text-emerald border-emerald/30">
                        +{missionData.reward_xp} XP
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{missionData.description}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mt-1 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(mission.progress * 100)}%</span>
                      </div>
                      <Progress value={mission.progress * 100} className="h-1.5 bg-navy/40" />
                    </div>
                    {missionData.reward_chips > 0 && (
                      <div className="text-xs text-amber-400 mt-1">
                        {t('achievements.alsoEarn')} {missionData.reward_chips} chips
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-muted-foreground">
                {t('achievements.noActiveMissions')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('achievements.checkBackLater')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-6 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('achievements.title')}</h1>
          <p className="text-muted-foreground">{t('achievements.description')}</p>
        </div>

        <div className="flex gap-2 items-center bg-emerald/10 px-4 py-2 rounded-md">
          <Trophy className="h-5 w-5 text-emerald" />
          <span>
            {completedAchievementsCount} / {totalAchievementsCount} {t('achievements.unlocked')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {renderLevelCard()}
        </div>
        <div>
          {renderMissionsCard()}
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">{t('achievements.all')}</TabsTrigger>
            <TabsTrigger value="unlocked">{t('achievements.unlocked')}</TabsTrigger>
            <TabsTrigger value="locked">{t('achievements.locked')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <AchievementsSection 
              achievements={playerAchievements || []} 
              loading={achievementsLoading}
            />
          </TabsContent>
          
          <TabsContent value="unlocked">
            <AchievementsSection 
              achievements={(playerAchievements || []).filter(a => a.completed)} 
              loading={achievementsLoading}
            />
          </TabsContent>
          
          <TabsContent value="locked">
            <AchievementsSection 
              achievements={(playerAchievements || []).filter(a => !a.completed)} 
              loading={achievementsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AchievementsPage;
