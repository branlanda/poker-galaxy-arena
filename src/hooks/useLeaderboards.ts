
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Leaderboard, LeaderboardEntry } from '@/types/gamification';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export function useLeaderboards() {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Fetch all active leaderboards
  const fetchLeaderboards = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('leaderboards')
        .select('*')
        .eq('is_active', true)
        .order('category');
      
      if (error) {
        throw error;
      }
      
      setLeaderboards(data || []);
    } catch (error: any) {
      console.error('Error fetching leaderboards:', error);
      toast({
        title: t('errors.failedToLoad'),
        description: error.message || t('errors.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch entries for a specific leaderboard
  const fetchLeaderboardEntries = async (leaderboardId: string) => {
    setLoading(true);
    
    try {
      // Fetch player profiles along with their entries
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select(`
          id,
          leaderboard_id,
          player_id,
          score,
          rank,
          created_at,
          profiles:player_id (id, alias)
        `)
        .eq('leaderboard_id', leaderboardId)
        .order('rank');
      
      if (error) {
        throw error;
      }
      
      // Format data to include player names from profiles
      const formattedEntries = (data || []).map(entry => {
        let playerName = 'Unknown Player';
        
        if (entry.profiles && typeof entry.profiles === 'object') {
          // Safely access the alias property
          playerName = (entry.profiles as any).alias || 'Unknown Player';
        }
        
        return {
          ...entry,
          player_name: playerName
        };
      });
      
      setLeaderboardEntries(formattedEntries);
    } catch (error: any) {
      console.error('Error fetching leaderboard entries:', error);
      toast({
        title: t('errors.failedToLoad'),
        description: error.message || t('errors.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch of leaderboards
  useEffect(() => {
    fetchLeaderboards();
  }, []);
  
  return {
    leaderboards,
    leaderboardEntries,
    loading,
    fetchLeaderboards,
    fetchLeaderboardEntries
  };
}
