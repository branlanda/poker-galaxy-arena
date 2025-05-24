
import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  alias?: string;
  avatar_url?: string;
  wallet_address?: string;
  show_public_stats: boolean;
}

export interface PlayerStatistics {
  totalGamesPlayed: number;
  totalHands: number;
  winRate: number;
  biggestPot: number;
  totalWinnings: number;
  averagePosition: number;
  bestHand: string;
  favoriteGame: string;
  tournamentWins: number;
  rankPosition: number;
  rank?: number;
  level?: number;
  xp?: number;
}

export const useUserProfile = (userId?: string) => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [statistics, setStatistics] = useState<PlayerStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const profileId = userId || authUser?.id;
  
  const fetchProfile = async () => {
    if (!profileId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
        
      if (profileError) throw profileError;
      
      setProfile(profileData);
      
      // Fetch player statistics
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_player_statistics', { player_id: profileId });
        
      if (statsError && statsError.code !== 'PGRST116') throw statsError;
      
      if (statsData) {
        setStatistics({
          totalGamesPlayed: statsData.total_games_played || 0,
          totalHands: statsData.total_hands || 0,
          winRate: statsData.win_rate || 0,
          biggestPot: statsData.biggest_pot || 0,
          totalWinnings: statsData.total_winnings || 0,
          averagePosition: statsData.average_position || 0,
          bestHand: statsData.best_hand || 'None',
          favoriteGame: statsData.favorite_game || 'None',
          tournamentWins: statsData.tournament_wins || 0,
          rankPosition: statsData.rank_position || 0,
          rank: statsData.rank,
          level: statsData.level,
          xp: statsData.xp
        });
      } else {
        // If no stats found, set default values
        setStatistics({
          totalGamesPlayed: 0,
          totalHands: 0,
          winRate: 0,
          biggestPot: 0,
          totalWinnings: 0,
          averagePosition: 0,
          bestHand: 'None',
          favoriteGame: 'None',
          tournamentWins: 0,
          rankPosition: 0
        });
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profileId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileId);
        
      if (updateError) throw updateError;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (profileId) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [profileId]);
  
  return { profile, statistics, loading, error, updateProfile, fetchProfile };
};
