
import React from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { useAuth } from '@/stores/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Unlock, Lock, Medal, Trophy } from 'lucide-react';

export function AchievementsPage() {
  const { achievements, playerAchievements, loading } = useAchievements();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, typeof achievements>);
  
  const categories = Object.keys(groupedAchievements).sort();
  
  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <p>{t('loading', 'Loading...')}</p>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('achievements.title', 'Achievements')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('achievements.description', 'Complete challenges and earn rewards as you play')}
        </p>
      </div>
      
      {!user ? (
        <Card>
          <CardContent className="py-6 text-center">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-medium mb-2">
              {t('achievements.loginToTrack', 'Log in to track your achievements')}
            </h2>
            <p className="text-muted-foreground">
              {t('achievements.loginToTrackDescription', 'Create an account or log in to start collecting achievements and track your progress.')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <Trophy className="h-12 w-12 text-emerald" />
                <div>
                  <h3 className="text-lg font-medium">
                    {playerAchievements.filter(a => a.completed).length} / {achievements.length}
                  </h3>
                  <p className="text-muted-foreground">{t('achievements.completed', 'Achievements completed')}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <Medal className="h-12 w-12 text-amber-500" />
                <div>
                  <h3 className="text-lg font-medium">
                    {playerAchievements.reduce((sum, a) => sum + (a.completed ? 1 : 0), 0) * 100}
                  </h3>
                  <p className="text-muted-foreground">{t('achievements.totalPoints', 'Total points earned')}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-500">
                    {Math.round((playerAchievements.filter(a => a.completed).length / achievements.length) * 100)}%
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {t('achievements.completion', 'Completion')}
                  </h3>
                  <Progress 
                    value={(playerAchievements.filter(a => a.completed).length / achievements.length) * 100} 
                    className="h-2 mt-1 w-32"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {categories.length > 0 ? (
            <Tabs defaultValue={categories[0]}>
              <TabsList className="mb-4">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupedAchievements[category].map(achievement => {
                      const playerAchievement = playerAchievements.find(
                        pa => pa.achievement_id === achievement.id
                      );
                      const isUnlocked = !!playerAchievement?.completed;
                      
                      return (
                        <Card key={achievement.id} className={isUnlocked ? 'border-emerald/50' : 'opacity-75'}>
                          <CardHeader className="flex flex-row items-start gap-4">
                            <div className={`rounded-full p-2 ${isUnlocked ? 'bg-emerald/20' : 'bg-muted'}`}>
                              {isUnlocked ? (
                                <Unlock className="h-6 w-6 text-emerald" />
                              ) : (
                                <Lock className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <CardTitle className="text-base">
                                {achievement.name}
                              </CardTitle>
                              <div className="text-sm text-muted-foreground">
                                {achievement.description}
                              </div>
                              
                              {playerAchievement && !isUnlocked && (
                                <div className="mt-2">
                                  <div className="text-xs text-muted-foreground mb-1">
                                    {t('achievements.progress', 'Progress')}: 
                                    {' '}{Math.round(playerAchievement.progress)}%
                                  </div>
                                  <Progress 
                                    value={playerAchievement.progress} 
                                    className="h-2"
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-auto text-sm font-medium">
                              {achievement.points} {t('achievements.points', 'pts')}
                            </div>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t('achievements.noAchievements', 'No achievements available yet')}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
