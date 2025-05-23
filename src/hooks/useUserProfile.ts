
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { PlayerAchievement, Achievement } from '@/types/gamification';

// Define the player statistics interface
export interface PlayerStatistics {
  totalHands: number;
  winRate: number;
  totalWinnings: number;
  bestHand: string;
  tournamentWins: number;
  rankPosition: number;
  longestStreak: number;
}

export interface UserProfileData {
  achievements: PlayerAchievement[];
  stats: PlayerStatistics;
  friends: any[];
  recentGames: any[];
}

export const useUserProfile = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the provided userId or fall back to the current authenticated user
  const targetUserId = userId || user?.id;

  const fetchUserProfile = async () => {
    if (!targetUserId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Parallel requests for better performance
      const [
        achievementsResponse, 
        statsResponse, 
        friendsResponse, 
        recentGamesResponse
      ] = await Promise.all([
        // Fetch user achievements
        supabase
          .from('player_achievements')
          .select('*, achievement:achievements(*)')
          .eq('player_id', targetUserId),
          
        // Fetch player statistics from ledger entries
        supabase.rpc('get_player_stats', { player_id: targetUserId }),
        
        // Fetch friends list
        supabase
          .from('friends')
          .select('*, friend:players!friends_friend_id_fkey(user_id, alias, avatar_url)')
          .eq('user_id', targetUserId)
          .eq('status', 'ACCEPTED'),
          
        // Fetch recent games
        supabase
          .from('hands')
          .select('id, table_id, created_at, pot, winners_json')
          .eq('players_json->>player_id', targetUserId)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);
      
      // Process player statistics (with fallback to mock data if needed)
      const playerStats: PlayerStatistics = statsResponse.data || {
        totalHands: 583, 
        winRate: 53, 
        totalWinnings: 2.45, 
        bestHand: "Straight Flush", 
        tournamentWins: 3,
        rankPosition: 42,
        longestStreak: 7
      };
      
      setProfile({
        achievements: achievementsResponse.data || [],
        stats: playerStats,
        friends: friendsResponse.data || [],
        recentGames: recentGamesResponse.data || []
      });
    } catch (err: any) {
      console.error('Error loading profile data:', err);
      setError(err.message);
      toast({
        title: t('errors.loadFailed'),
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      fetchUserProfile();
    }
  }, [targetUserId]);

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchUserProfile
  };
};
