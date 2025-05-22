
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  category: string;
  points: number;
  requirements: Record<string, any>;
  created_at: string;
}

export interface PlayerAchievement {
  id: string;
  player_id: string;
  achievement_id: string;
  unlocked_at: string;
  progress: number;
  completed: boolean;
  achievement?: Achievement;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [playerAchievements, setPlayerAchievements] = useState<PlayerAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('category');
      
      if (achievementsError) throw achievementsError;
      
      // Parse JSON fields
      const parsedAchievements = achievementsData?.map(achievement => ({
        ...achievement,
        requirements: typeof achievement.requirements === 'string'
          ? JSON.parse(achievement.requirements)
          : achievement.requirements
      })) as Achievement[];
      
      setAchievements(parsedAchievements || []);
      
      // If user is logged in, fetch their achievements
      if (user) {
        const { data: playerAchievementsData, error: playerAchievementsError } = await supabase
          .from('player_achievements')
          .select('*, achievement:achievements(*)')
          .eq('player_id', user.id);
        
        if (playerAchievementsError) throw playerAchievementsError;
        
        // Parse JSON fields
        const parsedPlayerAchievements = playerAchievementsData?.map(pa => ({
          ...pa,
          achievement: pa.achievement ? {
            ...pa.achievement,
            requirements: typeof pa.achievement.requirements === 'string'
              ? JSON.parse(pa.achievement.requirements)
              : pa.achievement.requirements
          } : undefined
        })) as PlayerAchievement[];
        
        setPlayerAchievements(parsedPlayerAchievements || []);
      }
    } catch (err: any) {
      console.error('Error fetching achievements:', err);
      setError(err.message);
      toast({
        title: t('errors.fetchFailed'),
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
    
    // Set up real-time subscription for achievement changes
    if (user) {
      const channel = supabase
        .channel('player_achievements_changes')
        .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'player_achievements',
              filter: `player_id=eq.${user.id}` 
            },
            async (payload) => {
              if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                // Fetch the full achievement details
                const { data } = await supabase
                  .from('player_achievements')
                  .select('*, achievement:achievements(*)')
                  .eq('id', payload.new.id)
                  .single();
                
                if (data) {
                  // Parse JSON fields for the achievement
                  const parsedData = {
                    ...data,
                    achievement: data.achievement ? {
                      ...data.achievement,
                      requirements: typeof data.achievement.requirements === 'string'
                        ? JSON.parse(data.achievement.requirements)
                        : data.achievement.requirements
                    } : undefined
                  } as PlayerAchievement;
                  
                  // Update achievement in state
                  setPlayerAchievements(prev => {
                    const exists = prev.some(pa => pa.id === parsedData.id);
                    if (exists) {
                      return prev.map(pa => pa.id === parsedData.id ? parsedData : pa);
                    } else {
                      return [...prev, parsedData];
                    }
                  });
                  
                  // Show notification for newly completed achievements
                  if (payload.eventType === 'UPDATE' && 
                      payload.new.completed && 
                      !payload.old.completed) {
                    const achievementName = parsedData.achievement?.name || 'Achievement';
                    toast({
                      title: t('achievements.unlocked'),
                      description: achievementName,
                    });
                  }
                }
              }
            })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id]);

  return { 
    achievements,
    playerAchievements,
    loading,
    error,
    refreshAchievements: fetchAchievements,
  };
};
