
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tournament, TournamentRegistration } from '@/types/tournaments';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export const useTournamentRegistration = (tournament?: Tournament) => {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registration, setRegistration] = useState<TournamentRegistration | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Check if the user is registered for this tournament
  const checkRegistration = async () => {
    if (!user || !tournament) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('*')
        .eq('tournament_id', tournament.id)
        .eq('player_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        console.error('Error checking registration:', error);
        return;
      }
      
      setRegistered(!!data);
      setRegistration(data || null);
    } catch (err) {
      console.error('Error checking registration:', err);
    } finally {
      setLoading(false);
    }
  };

  // Register the user for a tournament
  const registerForTournament = async (accessCode?: string) => {
    if (!user || !tournament) {
      toast({
        title: t('errors.notLoggedIn', 'Not logged in'),
        description: t('errors.loginRequired', 'You must be logged in to register for tournaments'),
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      setLoading(true);
      
      // Check if tournament requires access code
      if (tournament.is_private && tournament.access_code && tournament.access_code !== accessCode) {
        toast({
          title: t('errors.invalidAccessCode', 'Invalid access code'),
          description: t('errors.cannotJoinPrivateTournament', 'Cannot join private tournament with invalid access code'),
          variant: 'destructive',
        });
        return null;
      }
      
      // Check if the tournament is open for registration
      const now = new Date();
      const registrationOpenTime = new Date(tournament.registration_open_time);
      const registrationCloseTime = tournament.registration_close_time 
        ? new Date(tournament.registration_close_time) 
        : new Date(tournament.start_time);
        
      if (now < registrationOpenTime) {
        toast({
          title: t('errors.registrationNotOpen', 'Registration not open'),
          description: t('errors.registrationOpensAt', 'Registration opens at {time}', { 
            time: registrationOpenTime.toLocaleString() 
          }),
          variant: 'destructive',
        });
        return null;
      }
      
      if (now > registrationCloseTime) {
        toast({
          title: t('errors.registrationClosed', 'Registration closed'),
          description: t('errors.registrationClosedAt', 'Registration closed at {time}', { 
            time: registrationCloseTime.toLocaleString() 
          }),
          variant: 'destructive',
        });
        return null;
      }
      
      // Register the user
      const { data, error } = await supabase
        .from('tournament_registrations')
        .insert({
          tournament_id: tournament.id,
          player_id: user.id,
          chips: tournament.starting_chips,
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setRegistered(true);
      setRegistration(data);
      
      toast({
        title: t('tournaments.registrationSuccess', 'Registration successful'),
        description: t('tournaments.registeredForTournament', 'You are now registered for {name}', { 
          name: tournament.name 
        }),
      });
      
      return data;
    } catch (err: any) {
      console.error('Error registering for tournament:', err);
      toast({
        title: t('errors.registrationFailed', 'Registration failed'),
        description: err.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Unregister from a tournament
  const unregisterFromTournament = async () => {
    if (!user || !tournament) {
      return false;
    }
    
    try {
      setLoading(true);
      
      // Check if the tournament allows unregistering
      const now = new Date();
      const tournamentStartTime = new Date(tournament.start_time);
      
      if (now >= tournamentStartTime) {
        toast({
          title: t('errors.cannotUnregister', 'Cannot unregister'),
          description: t('errors.tournamentAlreadyStarted', 'Cannot unregister from a tournament that has already started'),
          variant: 'destructive',
        });
        return false;
      }
      
      const { error } = await supabase
        .from('tournament_registrations')
        .delete()
        .eq('tournament_id', tournament.id)
        .eq('player_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setRegistered(false);
      setRegistration(null);
      
      toast({
        title: t('tournaments.unregistrationSuccess', 'Unregistered successfully'),
        description: t('tournaments.unregisteredFromTournament', 'You have been unregistered from {name}', { 
          name: tournament.name 
        }),
      });
      
      return true;
    } catch (err: any) {
      console.error('Error unregistering from tournament:', err);
      toast({
        title: t('errors.unregistrationFailed', 'Unregistration failed'),
        description: err.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    registered,
    registration,
    checkRegistration,
    registerForTournament,
    unregisterFromTournament,
  };
};
