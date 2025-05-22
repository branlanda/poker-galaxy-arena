
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tournament, TournamentFilters, DEFAULT_TOURNAMENT_FILTERS, BlindLevel, PayoutLevel } from '@/types/tournaments';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export const useTournaments = (filters: TournamentFilters = DEFAULT_TOURNAMENT_FILTERS) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('tournaments_new')
        .select('*, tournament_registrations(count)');
      
      // Apply filters
      if (filters.type && filters.type !== 'ALL') {
        query = query.eq('tournament_type', filters.type);
      }
      
      if (filters.status && filters.status !== 'ALL') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.buyInRange) {
        query = query
          .gte('buy_in', filters.buyInRange[0])
          .lte('buy_in', filters.buyInRange[1]);
      }
      
      if (!filters.showPrivate) {
        query = query.eq('is_private', false);
      }
      
      if (filters.searchQuery) {
        query = query.ilike('name', `%${filters.searchQuery}%`);
      }
      
      // Order by start time
      query = query.order('start_time', { ascending: true });
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Process data to include registered player counts and parse JSON fields
      const processedData = data?.map(tournament => {
        // Parse JSON fields
        const blindStructure: BlindLevel[] = typeof tournament.blind_structure === 'string' 
          ? JSON.parse(tournament.blind_structure) 
          : tournament.blind_structure || [];
          
        const payoutStructure: PayoutLevel[] = typeof tournament.payout_structure === 'string'
          ? JSON.parse(tournament.payout_structure)
          : tournament.payout_structure || [];
        
        return {
          ...tournament,
          blind_structure: blindStructure,
          payout_structure: payoutStructure,
          registered_players_count: tournament.tournament_registrations?.[0]?.count || 0
        } as unknown as Tournament;
      }) || [];
      
      setTournaments(processedData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching tournaments:', err);
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

  // Set up realtime subscription for new tournaments
  useEffect(() => {
    const channel = supabase
      .channel('public:tournaments_new')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'tournaments_new' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newTournamentData = payload.new as any;
              
              // Parse JSON fields
              const blindStructure: BlindLevel[] = typeof newTournamentData.blind_structure === 'string' 
                ? JSON.parse(newTournamentData.blind_structure) 
                : newTournamentData.blind_structure || [];
                
              const payoutStructure: PayoutLevel[] = typeof newTournamentData.payout_structure === 'string'
                ? JSON.parse(newTournamentData.payout_structure)
                : newTournamentData.payout_structure || [];
              
              const newTournament = {
                ...newTournamentData,
                blind_structure: blindStructure,
                payout_structure: payoutStructure,
                registered_players_count: 0
              } as Tournament;
              
              setTournaments(prev => [newTournament, ...prev]);
              
              toast({
                title: t('tournaments.new'),
                description: t('tournaments.newTournamentAdded', { name: newTournament.name }),
              });
            } else if (payload.eventType === 'UPDATE') {
              const updatedTournamentData = payload.new as any;
              
              // Parse JSON fields
              const blindStructure: BlindLevel[] = typeof updatedTournamentData.blind_structure === 'string' 
                ? JSON.parse(updatedTournamentData.blind_structure) 
                : updatedTournamentData.blind_structure || [];
                
              const payoutStructure: PayoutLevel[] = typeof updatedTournamentData.payout_structure === 'string'
                ? JSON.parse(updatedTournamentData.payout_structure)
                : updatedTournamentData.payout_structure || [];
              
              const updatedTournament = {
                ...updatedTournamentData,
                blind_structure: blindStructure,
                payout_structure: payoutStructure
              } as Tournament;
              
              setTournaments(prev => 
                prev.map(t => t.id === updatedTournament.id ? 
                  {...updatedTournament, registered_players_count: t.registered_players_count} : t)
              );
            } else if (payload.eventType === 'DELETE') {
              const deletedTournamentId = (payload.old as any).id;
              setTournaments(prev => 
                prev.filter(t => t.id !== deletedTournamentId)
              );
            }
          })
      .subscribe();
      
    // Initial fetch
    fetchTournaments();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [JSON.stringify(filters)]);
  
  return { tournaments, loading, error, refreshTournaments: fetchTournaments };
};
