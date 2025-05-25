
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Leaderboard, LeaderboardEntry } from '@/types/gamification';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

// Mock player data structure for leaderboards
interface LeaderboardPlayer {
  id: string;
  alias: string;
  avatarUrl?: string;
  level: number;
  stats?: {
    earnings?: number;
    tournamentsWon?: number;
    handsPlayed?: number;
    monthlyEarnings?: number;
  };
}

export function useLeaderboards() {
  const [leaderboards, setLeaderboards] = useState<Record<string, LeaderboardPlayer[]>>({});
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Generate mock leaderboard data
  const generateMockLeaderboards = () => {
    const mockPlayers: LeaderboardPlayer[] = [
      {
        id: '1',
        alias: 'PokerPro2024',
        avatarUrl: '',
        level: 15,
        stats: {
          earnings: 25000,
          tournamentsWon: 12,
          handsPlayed: 15000,
          monthlyEarnings: 8500
        }
      },
      {
        id: '2',
        alias: 'ChipMaster',
        avatarUrl: '',
        level: 12,
        stats: {
          earnings: 18500,
          tournamentsWon: 8,
          handsPlayed: 12000,
          monthlyEarnings: 6200
        }
      },
      {
        id: '3',
        alias: 'BluffKing',
        avatarUrl: '',
        level: 10,
        stats: {
          earnings: 15000,
          tournamentsWon: 5,
          handsPlayed: 9500,
          monthlyEarnings: 4800
        }
      },
      {
        id: '4',
        alias: 'RiverRat',
        avatarUrl: '',
        level: 8,
        stats: {
          earnings: 12000,
          tournamentsWon: 3,
          handsPlayed: 8000,
          monthlyEarnings: 3500
        }
      },
      {
        id: '5',
        alias: 'FoldMaster',
        avatarUrl: '',
        level: 6,
        stats: {
          earnings: 8500,
          tournamentsWon: 2,
          handsPlayed: 6500,
          monthlyEarnings: 2200
        }
      }
    ];

    return {
      earnings: [...mockPlayers].sort((a, b) => (b.stats?.earnings || 0) - (a.stats?.earnings || 0)),
      tournaments: [...mockPlayers].sort((a, b) => (b.stats?.tournamentsWon || 0) - (a.stats?.tournamentsWon || 0)),
      hands: [...mockPlayers].sort((a, b) => (b.stats?.handsPlayed || 0) - (a.stats?.handsPlayed || 0)),
      monthly: [...mockPlayers].sort((a, b) => (b.stats?.monthlyEarnings || 0) - (a.stats?.monthlyEarnings || 0))
    };
  };
  
  // Fetch all active leaderboards
  const fetchLeaderboards = async () => {
    setLoading(true);
    
    try {
      // For now, use mock data since we don't have actual leaderboard data
      const mockData = generateMockLeaderboards();
      setLeaderboards(mockData);
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
