
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export interface TournamentPlayerStats {
  id: string;
  tournament_id: string;
  player_id: string;
  final_position: number | null;
  chips_won: number;
  prize_amount: number;
  hands_played: number;
  hands_won: number;
  elimination_hand: any;
  play_duration: string | null;
  created_at: string;
}

export interface PlayerTournamentHistory {
  id: string;
  player_id: string;
  tournaments_played: number;
  tournaments_won: number;
  tournaments_final_table: number;
  total_prize_money: number;
  best_finish: number | null;
  average_finish: number | null;
  roi: number;
  updated_at: string;
}

export function useTournamentStats() {
  const [playerHistory, setPlayerHistory] = useState<PlayerTournamentHistory | null>(null);
  const [tournamentStats, setTournamentStats] = useState<TournamentPlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPlayerHistory = async (playerId?: string) => {
    const targetPlayerId = playerId || user?.id;
    if (!targetPlayerId) return;

    try {
      const { data, error } = await supabase
        .from('player_tournament_history')
        .select('*')
        .eq('player_id', targetPlayerId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setPlayerHistory(data);
    } catch (err: any) {
      console.error('Error fetching player history:', err);
    }
  };

  const fetchTournamentStats = async (playerId?: string) => {
    const targetPlayerId = playerId || user?.id;
    if (!targetPlayerId) return;

    try {
      const { data, error } = await supabase
        .from('tournament_player_stats')
        .select(`
          *,
          tournaments_new (
            name,
            buy_in,
            start_time
          )
        `)
        .eq('player_id', targetPlayerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTournamentStats(data || []);
    } catch (err: any) {
      console.error('Error fetching tournament stats:', err);
    }
  };

  const recordTournamentResult = async (
    tournamentId: string,
    playerId: string,
    result: {
      final_position?: number;
      chips_won?: number;
      prize_amount?: number;
      hands_played?: number;
      hands_won?: number;
      elimination_hand?: any;
      play_duration?: string;
    }
  ) => {
    try {
      const { error } = await supabase
        .from('tournament_player_stats')
        .upsert({
          tournament_id: tournamentId,
          player_id: playerId,
          ...result
        });

      if (error) throw error;
    } catch (err: any) {
      console.error('Error recording tournament result:', err);
    }
  };

  const getLeaderboard = async (timeframe: 'week' | 'month' | 'all' = 'all') => {
    try {
      let query = supabase
        .from('player_tournament_history')
        .select(`
          *,
          profiles (alias, avatar_url)
        `)
        .order('roi', { ascending: false })
        .limit(10);

      // Add time filter if needed
      if (timeframe !== 'all') {
        const days = timeframe === 'week' ? 7 : 30;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        query = query.gte('updated_at', cutoffDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchPlayerHistory();
      fetchTournamentStats();
      setLoading(false);
    }
  }, [user]);

  return {
    playerHistory,
    tournamentStats,
    loading,
    fetchPlayerHistory,
    fetchTournamentStats,
    recordTournamentResult,
    getLeaderboard
  };
}
