
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';

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
  rank: number;
  level: number;
  xp: number;
}

export interface GameHistoryItem {
  id: string;
  gameType: string;
  tableName: string;
  buyIn: number;
  result: number;
  position?: number;
  duration?: string;
  playedAt: string;
}

export function usePlayerStatistics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [statistics, setStatistics] = useState<PlayerStatistics | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatistics = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Fetch player statistics using the database function
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_player_statistics', { player_uuid: user.id });

      if (statsError) throw statsError;

      if (statsData && statsData.length > 0) {
        const stats = statsData[0];
        setStatistics({
          totalGamesPlayed: stats.total_games_played || 0,
          totalHands: stats.total_hands || 0,
          winRate: parseFloat(stats.win_rate) || 0,
          biggestPot: parseFloat(stats.biggest_pot) || 0,
          totalWinnings: parseFloat(stats.total_winnings) || 0,
          averagePosition: parseFloat(stats.average_position) || 0,
          bestHand: stats.best_hand || 'None',
          favoriteGame: stats.favorite_game || 'None',
          tournamentWins: stats.tournament_wins || 0,
          rankPosition: stats.rank_position || 0,
          rank: stats.rank || 1,
          level: stats.level || 1,
          xp: stats.xp || 0
        });
      }

      // Fetch game history
      const { data: historyData, error: historyError } = await supabase
        .from('game_history')
        .select('*')
        .eq('player_id', user.id)
        .order('played_at', { ascending: false })
        .limit(50);

      if (historyError) throw historyError;

      setGameHistory(historyData?.map(item => ({
        id: item.id,
        gameType: item.game_type,
        tableName: item.table_name || 'Unknown Table',
        buyIn: parseFloat(item.buy_in) || 0,
        result: parseFloat(item.result) || 0,
        position: item.position,
        duration: item.duration,
        playedAt: item.played_at
      })) || []);

    } catch (error: any) {
      console.error('Error fetching player statistics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load player statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [user?.id]);

  return {
    statistics,
    gameHistory,
    loading,
    refetch: fetchStatistics
  };
}
