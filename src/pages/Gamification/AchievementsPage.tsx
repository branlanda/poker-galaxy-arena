
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Target, 
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAchievements } from '@/hooks/useAchievements';

const AchievementsPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    achievements, 
    userProgress, 
    dailyMissions, 
    loading 
  } = useAchievements();

  if (loading) {
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
            {t('achievements.title', 'Achievements & Missions')}
          </h1>
          <p className="text-xl text-gray-400">
            {t('achievements.description', 'Complete challenges and earn rewards')}
          </p>
        </div>

        {/* Player Level Progress */}
        <Card className="bg-gradient-to-r from-emerald/20 to-gold/20 border-emerald/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {t('achievements.level', 'Level')} {userProgress?.level || 1}
                </h2>
                <p className="text-gray-300">
                  {userProgress?.currentXP || 0} / {userProgress?.nextLevelXP || 1000} XP
                </p>
              </div>
              <Award className="h-12 w-12 text-gold" />
            </div>
            <Progress 
              value={(userProgress?.currentXP || 0) / (userProgress?.nextLevelXP || 1000) * 100} 
              className="h-3 mb-2" 
            />
            <p className="text-sm text-gray-400">
              {(userProgress?.nextLevelXP || 1000) - (userProgress?.currentXP || 0)} XP {t('achievements.toNextLevel', 'to next level')}
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-navy-light">
            <TabsTrigger value="achievements" className="data-[state=active]:bg-emerald">
              <Trophy className="h-4 w-4 mr-2" />
              {t('achievements.all', 'All Achievements')}
            </TabsTrigger>
            <TabsTrigger value="missions" className="data-[state=active]:bg-emerald">
              <Target className="h-4 w-4 mr-2" />
              {t('achievements.dailyMissions', 'Daily Missions')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements">
            {achievements.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <Card 
                    key={achievement.id} 
                    className={`border transition-all hover:border-emerald/50 ${
                      achievement.completed ? 'bg-emerald/10 border-emerald/30' : 'bg-navy/50 border-gray-600'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{achievement.title}</CardTitle>
                        {achievement.completed && <Star className="h-5 w-5 text-gold fill-gold" />}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{achievement.description}</p>
                      
                      {achievement.progress !== undefined && (
                        <div className="mb-4">
                          <Progress 
                            value={(achievement.progress / achievement.target) * 100} 
                            className="h-2 mb-1" 
                          />
                          <p className="text-xs text-gray-400">
                            {achievement.progress} / {achievement.target}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge variant={achievement.completed ? 'default' : 'secondary'}>
                          {achievement.xpReward} XP
                        </Badge>
                        {achievement.completed && (
                          <Badge className="bg-emerald">
                            {t('achievements.unlocked', 'Unlocked')}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-navy/50 border-gray-600">
                <CardContent className="p-12 text-center">
                  <Trophy className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Achievements Yet</h3>
                  <p className="text-gray-400 mb-6">
                    {t('achievements.playToUnlock', 'Play games and complete challenges to unlock achievements')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="missions">
            {dailyMissions.length > 0 ? (
              <div className="space-y-4">
                {dailyMissions.map((mission) => (
                  <Card key={mission.id} className="bg-navy/50 border-gray-600">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{mission.title}</h3>
                          <p className="text-gray-300 mb-3">{mission.description}</p>
                          
                          <div className="mb-3">
                            <Progress 
                              value={(mission.progress / mission.target) * 100} 
                              className="h-2 mb-1" 
                            />
                            <p className="text-sm text-gray-400">
                              {mission.progress} / {mission.target}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-6 text-right">
                          <Badge className="bg-emerald mb-2">{mission.xpReward} XP</Badge>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {mission.timeRemaining}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-navy/50 border-gray-600">
                <CardContent className="p-12 text-center">
                  <Target className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t('achievements.noActiveMissions', 'No Active Missions')}
                  </h3>
                  <p className="text-gray-400">
                    {t('achievements.checkBackLater', 'Check back later for new missions')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AchievementsPage;
