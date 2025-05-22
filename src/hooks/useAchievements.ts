
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Achievement, PlayerAchievement } from '@/types/gamification';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

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
      
      setAchievements(achievementsData || []);
      
      // If user is logged in, fetch their achievements
      if (user) {
        const { data: playerAchievementsData, error: playerAchievementsError } = await supabase
          .from('player_achievements')
          .select('*, achievement:achievements(*)')
          .eq('player_id', user.id);
        
        if (playerAchievementsError) throw playerAchievementsError;
        
        setPlayerAchievements(playerAchievementsData || []);
      }
    } catch (err: any) {
      console.error('Error fetching achievements:', err);
      setError(err.message);
      toast({
        title: t('errors.fetchFailed', 'Failed to fetch achievements'),
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
                  // Update achievement in state
                  setPlayerAchievements(prev => {
                    const exists = prev.some(pa => pa.id === data.id);
                    if (exists) {
                      return prev.map(pa => pa.id === data.id ? data : pa);
                    } else {
                      return [...prev, data];
                    }
                  });
                  
                  // Show notification for newly completed achievements
                  if (payload.eventType === 'UPDATE' && 
                      payload.new.completed && 
                      !payload.old.completed) {
                    const achievementName = data.achievement?.name || 'Achievement';
                    toast({
                      title: t('achievements.unlocked', 'Achievement Unlocked!'),
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
