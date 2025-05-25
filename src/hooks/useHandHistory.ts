
import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { DetailedHandHistory, HandHistoryFilters, HandAnalysis, SharedHand, HandReport } from '@/types/handHistory';

export function useHandHistory() {
  const { user } = useAuth();
  const [hands, setHands] = useState<DetailedHandHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  const fetchHands = async (
    filters: HandHistoryFilters = {},
    page: number = 1,
    limit: number = 20
  ) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('detailed_hand_history')
        .select('*', { count: 'exact' })
        .eq('player_id', user.id)
        .order('played_at', { ascending: false });
      
      // Apply filters
      if (filters.dateFrom) {
        query = query.gte('played_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('played_at', filters.dateTo);
      }
      if (filters.gameType) {
        query = query.eq('game_type', filters.gameType);
      }
      if (filters.tableType) {
        query = query.eq('table_type', filters.tableType);
      }
      if (filters.result === 'WINS') {
        query = query.gt('player_result', 0);
      } else if (filters.result === 'LOSSES') {
        query = query.lt('player_result', 0);
      }
      if (filters.minPot) {
        query = query.gte('final_pot', filters.minPot);
      }
      if (filters.maxPot) {
        query = query.lte('final_pot', filters.maxPot);
      }
      if (filters.handStrength) {
        query = query.eq('hand_strength', filters.handStrength);
      }
      if (filters.tableName) {
        query = query.ilike('table_name', `%${filters.tableName}%`);
      }
      
      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);
      
      const { data, error: fetchError, count } = await query;
      
      if (fetchError) throw fetchError;
      
      setHands(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('Error fetching hand history:', err);
      setError(err.message || 'Failed to load hand history');
    } finally {
      setLoading(false);
    }
  };
  
  const getHandById = async (handId: string): Promise<DetailedHandHistory | null> => {
    try {
      const { data, error } = await supabase
        .from('detailed_hand_history')
        .select('*')
        .eq('id', handId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error fetching hand:', err);
      return null;
    }
  };
  
  const createAnalysis = async (
    handId: string,
    content: string,
    rating?: number,
    tags: string[] = [],
    isPublic: boolean = false
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('hand_analysis')
        .insert({
          hand_id: handId,
          player_id: user.id,
          analysis_type: 'MANUAL',
          content,
          rating,
          tags,
          is_public: isPublic
        });
      
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error creating analysis:', err);
      return false;
    }
  };
  
  const shareHand = async (
    handId: string,
    title?: string,
    description?: string,
    isPublic: boolean = false,
    expiresAt?: string
  ): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('shared_hands')
        .insert({
          hand_id: handId,
          shared_by: user.id,
          title,
          description,
          is_public: isPublic,
          expires_at: expiresAt
        })
        .select('share_code')
        .single();
      
      if (error) throw error;
      return data.share_code;
    } catch (err: any) {
      console.error('Error sharing hand:', err);
      return null;
    }
  };
  
  const reportHand = async (
    handId: string,
    reportType: 'COLLUSION' | 'BOT_PLAY' | 'SUSPICIOUS_BETTING',
    description: string,
    reportedPlayerId?: string
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('hand_reports')
        .insert({
          hand_id: handId,
          reported_by: user.id,
          reported_player_id: reportedPlayerId,
          report_type: reportType,
          description
        });
      
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error reporting hand:', err);
      return false;
    }
  };
  
  return {
    hands,
    loading,
    error,
    totalCount,
    fetchHands,
    getHandById,
    createAnalysis,
    shareHand,
    reportHand
  };
}
