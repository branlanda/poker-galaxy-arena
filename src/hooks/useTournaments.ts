
import { useState, useEffect } from 'react';
import { Tournament, TournamentDetail, TournamentFilters } from '@/types/tournaments';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export function useTournaments(filters?: TournamentFilters) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('tournaments')
        .select('*');
      
      // Apply filters if provided
      if (filters) {
        if (filters.searchQuery) {
          query = query.ilike('name', `%${filters.searchQuery}%`);
        }
        
        if (filters.type && filters.type !== 'ALL') {
          query = query.eq('tournament_type', filters.type);
        }
        
        if (filters.status && filters.status !== 'ALL') {
          query = query.eq('status', filters.status);
        }
        
        if (!filters.showPrivate) {
          query = query.eq('is_private', false);
        }
        
        if (filters.buyInRange) {
          query = query
            .gte('buy_in', filters.buyInRange[0])
            .lte('buy_in', filters.buyInRange[1]);
        }
      }
      
      query = query.order('start_date', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setTournaments(data || []);
    } catch (error: any) {
      console.error('Error fetching tournaments:', error);
      setError(error.message || t('errors.tryAgain'));
      toast({
        title: t('errors.failedToLoad'),
        description: error.message || t('errors.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const refreshTournaments = () => {
    fetchTournaments();
  };
  
  useEffect(() => {
    fetchTournaments();
  }, [filters?.searchQuery, filters?.type, filters?.status, filters?.showPrivate, filters?.buyInRange]);
  
  return {
    tournaments,
    loading,
    error,
    fetchTournaments,
    refreshTournaments
  };
}
