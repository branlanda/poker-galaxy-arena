
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { Achievement, PlayerAchievement } from '@/types/gamification';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [playerAchievements, setPlayerAchievements] = useState<PlayerAchievement[]>([]);
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
      setAchievements(achievementsData || []);
      
      // If player doesn't have records for all achievements, create them with default values
      const playerAchievementsMap = new Map((playerData || []).map(pa => [pa.achievement_id, pa]));
      
      const mergedAchievements = (achievementsData || []).map(achievement => {
        const playerAchievement = playerAchievementsMap.get(achievement.id);
        
        if (playerAchievement) {
          return {
            ...playerAchievement,
            achievement
          };
        } else {
          // Create default player achievement if it doesn't exist
          return {
            id: `temp-${achievement.id}`,
            player_id: user.id,
            achievement_id: achievement.id,
            progress: 0,
            completed: false,
            created_at: new Date().toISOString(),
            achievement
          };
        }
      });
      
      setPlayerAchievements(mergedAchievements);
      
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
      const achievement = playerAchievements.find(
        a => a.achievement_id === achievementId && a.completed && !a.completed_at // Using completed_at to check if reward is claimed
      );
      
      if (!achievement) {
        toast({
          title: t('errors.cannotClaim'),
          description: t('errors.achievementNotCompleted'),
          variant: 'destructive',
        });
        return;
      }
      
      // Claim the reward on the server (this would typically be handled by a secure RPC function or edge function)
      const { error } = await supabase.rpc('claim_achievement_reward', {
        p_achievement_id: achievementId,
        p_player_id: user.id
      });
      
      if (error) {
        throw error;
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
    loading,
    refreshAchievements,
    claimAchievementReward
  };
}
