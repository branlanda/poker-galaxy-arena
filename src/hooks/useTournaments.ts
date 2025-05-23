import { useState, useEffect } from 'react';
import { TournamentData, TournamentDetailData } from '@/types/tournaments';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setTournaments(data || []);
    } catch (error: any) {
      console.error('Error fetching tournaments:', error);
      toast({
        title: t('errors.failedToLoad'),
        description: error.message || t('errors.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTournaments();
  }, []);
  
  return {
    tournaments,
    loading,
    fetchTournaments
  };
}

