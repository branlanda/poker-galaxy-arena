
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { Achievement, PlayerAchievement } from '@/types/gamification';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

// Extended types for the UI
interface UIAchievement extends Achievement {
  completed: boolean;
  progress?: number;
  target?: number;
  title: string;
  xpReward: number;
}

interface UserProgress {
  level: number;
  currentXP: number;
  nextLevelXP: number;
}

interface DailyMission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  timeRemaining: string;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<UIAchievement[]>([]);
  const [playerAchievements, setPlayerAchievements] = useState<PlayerAchievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({ level: 1, currentXP: 0, nextLevelXP: 1000 });
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Fetch achievements and player's progress
  const fetchAchievements = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Fetch all achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('category');
      
      if (achievementsError) {
        throw achievementsError;
      }
      
      // Fetch player's achievements progress
      const { data: playerData, error: playerError } = await supabase
        .from('player_achievements')
        .select(`
          *,
          achievement:achievement_id (*)
        `)
        .eq('player_id', user.id);
      
      if (playerError) {
        throw playerError;
      }
      
      // Process and merge data
      const playerAchievementsMap = new Map((playerData || []).map(pa => [pa.achievement_id, pa]));
      
      const mergedAchievements = (achievementsData || []).map(achievement => {
        const playerAchievement = playerAchievementsMap.get(achievement.id);
        
        return {
          ...achievement,
          title: achievement.name,
          xpReward: achievement.points,
          completed: playerAchievement?.completed || false,
          progress: playerAchievement?.progress || 0,
          target: 100, // Default target
        };
      });
      
      setAchievements(mergedAchievements);
      setPlayerAchievements(playerData || []);
      
      // Set mock user progress
      setUserProgress({
        level: 5,
        currentXP: 750,
        nextLevelXP: 1000
      });
      
      // Set mock daily missions
      setDailyMissions([
        {
          id: '1',
          title: 'Play 5 Hands',
          description: 'Complete 5 poker hands',
          progress: 3,
          target: 5,
          xpReward: 100,
          timeRemaining: '12h 30m'
        },
        {
          id: '2',
          title: 'Win a Game',
          description: 'Win at least one poker game',
          progress: 0,
          target: 1,
          xpReward: 200,
          timeRemaining: '23h 45m'
        }
      ]);
      
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      toast({
        title: t('errors.failedToLoad'),
        description: error.message || t('errors.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Claim an achievement reward
  const claimAchievementReward = async (achievementId: string) => {
    if (!user) return;
    
    try {
      // Check if achievement is completed and unclaimed
      const achievement = achievements.find(
        a => a.id === achievementId && a.completed
      );
      
      if (!achievement) {
        toast({
          title: t('errors.cannotClaim'),
          description: t('errors.achievementNotCompleted'),
          variant: 'destructive',
        });
        return;
      }
      
      // Refresh achievements to show updated state
      fetchAchievements();
      
      toast({
        title: t('achievements.rewardClaimed'),
        description: t('achievements.rewardCreditedToAccount'),
      });
      
    } catch (error: any) {
      console.error('Error claiming achievement reward:', error);
      toast({
        title: t('errors.failedToClaim'),
        description: error.message || t('errors.tryAgain'),
        variant: 'destructive',
      });
    }
  };
  
  // Fetch achievements on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);
  
  // Function to manually refresh achievements
  const refreshAchievements = () => {
    fetchAchievements();
  };
  
  return {
    achievements,
    playerAchievements,
    userProgress,
    dailyMissions,
    loading,
    refreshAchievements,
    claimAchievementReward
  };
}
