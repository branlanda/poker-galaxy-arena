
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export interface Leaderboard {
  id: string;
  name: string;
  description?: string;
  category: string;
  period: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  prize_pool?: number;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  leaderboard_id: string;
  player_id: string;
  score: number;
  rank?: number;
  updated_at: string;
  player_name?: string;
  player_avatar?: string;
}

export const useLeaderboards = () => {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [activeLeaderboard, setActiveLeaderboard] = useState<Leaderboard | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Fetch all available leaderboards
  const fetchLeaderboards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('leaderboards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setLeaderboards(data || []);
      
      // If we have leaderboards, select the first one by default
      if (data && data.length > 0 && !activeLeaderboard) {
        setActiveLeaderboard(data[0]);
        await fetchLeaderboardEntries(data[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching leaderboards:', err);
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

  // Fetch entries for a specific leaderboard
  const fetchLeaderboardEntries = async (leaderboardId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('leaderboard_entries')
        .select('*, profiles:player_id(alias, avatar_url)')
        .eq('leaderboard_id', leaderboardId)
        .order('rank', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      // Process data to include player names and avatars
      const processedEntries = data?.map(entry => {
        // Type assertion to handle the profiles data properly
        const profiles = entry.profiles as { alias?: string, avatar_url?: string } | null;
        
        return {
          ...entry,
          player_name: profiles?.alias || 'Unknown Player',
          player_avatar: profiles?.avatar_url || null
        };
      }) as LeaderboardEntry[];
      
      setEntries(processedEntries || []);
    } catch (err: any) {
      console.error('Error fetching leaderboard entries:', err);
      setError(err.message);
      toast({
        title: t('errors.fetchFailed'),
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Set the active leaderboard and fetch its entries
  const selectLeaderboard = async (leaderboard: Leaderboard) => {
    setActiveLeaderboard(leaderboard);
    await fetchLeaderboardEntries(leaderboard.id);
  };

  useEffect(() => {
    fetchLeaderboards();
    
    // Set up real-time updates for leaderboard entries
    if (activeLeaderboard) {
      const channel = supabase
        .channel(`leaderboard_entries_${activeLeaderboard.id}`)
        .on('postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'leaderboard_entries',
              filter: `leaderboard_id=eq.${activeLeaderboard.id}`
            },
            (payload) => {
              // Re-fetch entries when changes occur
              fetchLeaderboardEntries(activeLeaderboard.id);
              
              // Show notification if user's rank changed
              if (user && payload.eventType === 'UPDATE' && payload.new.player_id === user.id) {
                const oldRank = payload.old.rank;
                const newRank = payload.new.rank;
                
                if (oldRank && newRank && oldRank !== newRank) {
                  const improved = newRank < oldRank;
                  toast({
                    title: improved ? 
                      t('leaderboards.rankImproved') : 
                      t('leaderboards.rankChanged'),
                    description: improved ?
                      t('leaderboards.movedUpTo', { rank: newRank }) :
                      t('leaderboards.movedDownTo', { rank: newRank }),
                    variant: improved ? 'default' : 'destructive',
                  });
                }
              }
            })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeLeaderboard?.id]);

  return {
    leaderboards,
    activeLeaderboard,
    entries,
    loading,
    error,
    selectLeaderboard,
    refreshLeaderboards: fetchLeaderboards,
  };
};
