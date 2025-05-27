
import React from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { Trophy, Star, Clock, CheckCircle, Gift } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

const AchievementsPage = () => {
  const { t } = useTranslation();
  const {
    achievements,
    userProgress,
    dailyMissions,
    loading,
    refreshAchievements,
    claimAchievementReward
  } = useAchievements();

  if (loading) {
    return (
      <AppLayout showBreadcrumbs={false}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBreadcrumbs={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald mb-2">
            {t('achievements.title', 'Achievements')}
          </h1>
          <p className="text-gray-400">
            {t('achievements.description', 'Track your progress and earn rewards')}
          </p>
        </div>

        {/* User Progress */}
        <Card className="bg-navy/70 border-emerald/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald">
              <Star className="h-5 w-5" />
              {t('achievements.userProgress', 'Your Progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white">Level {userProgress.level}</span>
                <span className="text-gray-400">
                  {userProgress.currentXP} / {userProgress.nextLevelXP} XP
                </span>
              </div>
              <Progress 
                value={(userProgress.currentXP / userProgress.nextLevelXP) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements" className="text-white">
              {t('achievements.achievements', 'Achievements')}
            </TabsTrigger>
            <TabsTrigger value="daily" className="text-white">
              {t('achievements.dailyMissions', 'Daily Missions')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`bg-navy/70 border-emerald/20 transition-all hover:border-emerald/40 ${
                    achievement.completed ? 'ring-2 ring-emerald/50' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Trophy className={`h-5 w-5 ${achievement.completed ? 'text-emerald' : 'text-gray-400'}`} />
                        {achievement.title}
                      </CardTitle>
                      {achievement.completed && (
                        <CheckCircle className="h-5 w-5 text-emerald" />
                      )}
                    </div>
                    <CardDescription className="text-gray-400">
                      {achievement.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!achievement.completed && achievement.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">
                            {achievement.progress} / {achievement.target}
                          </span>
                        </div>
                        <Progress 
                          value={(achievement.progress / (achievement.target || 100)) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-emerald/20 text-emerald">
                        {achievement.completed ? (
                          <Gift className="h-3 w-3 mr-1" />
                        ) : (
                          <Star className="h-3 w-3 mr-1" />
                        )}
                        {achievement.xpReward} XP
                      </Badge>
                      
                      {achievement.completed && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => claimAchievementReward(achievement.id)}
                          className="border-emerald/20 text-emerald hover:bg-emerald/10"
                        >
                          {t('achievements.claim', 'Claim')}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyMissions.map((mission) => (
                <Card key={mission.id} className="bg-navy/70 border-emerald/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Clock className="h-5 w-5 text-emerald" />
                        {mission.title}
                      </CardTitle>
                      <Badge variant="outline" className="border-emerald/20 text-emerald">
                        {mission.timeRemaining}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      {mission.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">
                          {mission.progress} / {mission.target}
                        </span>
                      </div>
                      <Progress 
                        value={(mission.progress / mission.target) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-emerald/20 text-emerald">
                        <Star className="h-3 w-3 mr-1" />
                        {mission.xpReward} XP
                      </Badge>
                      
                      {mission.progress >= mission.target && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-emerald/20 text-emerald hover:bg-emerald/10"
                        >
                          {t('achievements.claim', 'Claim')}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AchievementsPage;
