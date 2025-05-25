
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Tournament, TournamentFilters, DEFAULT_TOURNAMENT_FILTERS, TournamentRegistration, TournamentTable } from '@/types/tournaments';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [tournamentRegistrations, setTournamentRegistrations] = useState<TournamentRegistration[]>([]);
  const [tournamentTables, setTournamentTables] = useState<TournamentTable[]>([]);
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

  const fetchTournamentById = async (tournamentId: string) => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('tournaments_new')
        .select('*')
        .eq('id', tournamentId)
        .single();
        
      if (fetchError) throw fetchError;
      
      setSelectedTournament(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch tournament details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTournamentRegistrations = async (tournamentId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('tournament_registrations')
        .select(`
          *,
          profiles:player_id (alias, avatar_url)
        `)
        .eq('tournament_id', tournamentId);
        
      if (fetchError) throw fetchError;
      
      // Format registrations with player names
      const formattedRegistrations = data?.map((registration: any) => ({
        ...registration,
        player_name: registration.profiles?.alias || 'Unknown Player',
        player_avatar: registration.profiles?.avatar_url,
        registered_at: registration.registration_time
      })) || [];
      
      setTournamentRegistrations(formattedRegistrations);
    } catch (err: any) {
      console.error('Error fetching tournament registrations:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch tournament registrations',
        variant: 'destructive',
      });
    }
  };

  const fetchTournamentTables = async (tournamentId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('tournament_tables')
        .select(`
          *,
          tournament_seats (
            *,
            profiles:player_id (alias, avatar_url)
          )
        `)
        .eq('tournament_id', tournamentId);
        
      if (fetchError) throw fetchError;
      
      // Format tables with seats
      const formattedTables = data?.map((table: any) => ({
        ...table,
        seats: table.tournament_seats?.map((seat: any) => ({
          ...seat,
          player_name: seat.profiles?.alias || 'Unknown Player',
          player_avatar: seat.profiles?.avatar_url
        })) || []
      })) || [];
      
      setTournamentTables(formattedTables);
    } catch (err: any) {
      console.error('Error fetching tournament tables:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch tournament tables',
        variant: 'destructive',
      });
    }
  };

  const createTournamentNotification = async (
    tournamentId: string,
    type: 'tournament_starting' | 'tournament_started' | 'player_eliminated' | 'blind_level_change' | 'break_started' | 'break_ended' | 'final_table' | 'tournament_completed',
    title: string,
    message: string,
    playerId?: string,
    data?: any
  ) => {
    try {
      const { error } = await supabase
        .from('tournament_notifications')
        .insert({
          tournament_id: tournamentId,
          player_id: playerId || null,
          notification_type: type,
          title,
          message,
          data: data || {}
        });

      if (error) throw error;
    } catch (err: any) {
      console.error('Error creating tournament notification:', err);
    }
  };

  const notifyTournamentStarting = async (tournament: Tournament) => {
    await createTournamentNotification(
      tournament.id,
      'tournament_starting',
      'Tournament Starting Soon',
      `${tournament.name} is starting in 5 minutes!`
    );
  };

  const notifyBlindLevelChange = async (tournament: Tournament, newLevel: number) => {
    await createTournamentNotification(
      tournament.id,
      'blind_level_change',
      'Blind Level Increased',
      `Blinds have increased to level ${newLevel} in ${tournament.name}`
    );
  };

  const refreshTournaments = () => {
    fetchTournaments();
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return {
    tournaments,
    selectedTournament,
    tournamentRegistrations,
    tournamentTables,
    loading,
    error,
    filters,
    setFilters,
    fetchTournaments,
    fetchTournamentById,
    fetchTournamentRegistrations,
    fetchTournamentTables,
    refreshTournaments,
    createTournamentNotification,
    notifyTournamentStarting,
    notifyBlindLevelChange
  };
}
