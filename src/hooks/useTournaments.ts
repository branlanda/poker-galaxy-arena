
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Tournament, TournamentFilters, DEFAULT_TOURNAMENT_FILTERS } from '@/types/tournaments';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<TournamentFilters>(DEFAULT_TOURNAMENT_FILTERS);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('tournaments_new')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      setTournaments(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch tournaments',
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
  }, []);

  return {
    tournaments,
    loading,
    error,
    filters,
    setFilters,
    fetchTournaments,
    refreshTournaments
  };
}
