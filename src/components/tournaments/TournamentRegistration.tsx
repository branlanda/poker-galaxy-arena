
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock, Users, AlertCircle, Check } from 'lucide-react';
import { Tournament } from '@/types/tournaments';
import { useTournamentRegistration } from '@/hooks/useTournamentRegistration';
import { useTranslation } from '@/hooks/useTranslation';
import { TournamentRegistrationsList } from './TournamentRegistrationsList';
import { supabase } from '@/integrations/supabase/client';

interface TournamentRegistrationProps {
  tournament: Tournament;
  onRegistrationChange?: () => void;
}

export function TournamentRegistration({ tournament, onRegistrationChange }: TournamentRegistrationProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState('');
  const [registrationsVisible, setRegistrationsVisible] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  
  const { 
    registered, 
    registration,
    loading, 
    checkRegistration, 
    registerForTournament, 
    unregisterFromTournament 
  } = useTournamentRegistration(tournament);

  useEffect(() => {
    checkRegistration();
  }, [tournament.id]);

  const handleRegister = async () => {
    const result = await registerForTournament(tournament.is_private ? accessCode : undefined);
    if (result) {
      onRegistrationChange?.();
    }
  };

  const handleUnregister = async () => {
    const result = await unregisterFromTournament();
    if (result) {
      onRegistrationChange?.();
    }
  };

  const loadRegistrations = async () => {
    setLoadingRegistrations(true);
    try {
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('*, players!inner(alias, avatar_url)')
        .eq('tournament_id', tournament.id);
        
      if (error) throw error;
      
      const formattedData = data.map(reg => ({
        ...reg,
        player_name: reg.players?.alias,
        player_avatar: reg.players?.avatar_url
      }));
      
      setRegistrations(formattedData);
    } catch (err) {
      console.error('Error loading registrations:', err);
      toast({
        title: t('errors.loadingFailed'),
        description: t('tournaments.registrationsLoadError'),
        variant: 'destructive',
      });
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const toggleRegistrationsList = () => {
    if (!registrationsVisible) {
      loadRegistrations();
    }
    setRegistrationsVisible(!registrationsVisible);
  };

  const getRegistrationStatus = () => {
    const now = new Date();
    const registrationOpenTime = new Date(tournament.registration_open_time);
    const registrationCloseTime = tournament.registration_close_time 
      ? new Date(tournament.registration_close_time) 
      : new Date(tournament.start_time);
    
    if (now < registrationOpenTime) {
      return 'not-open';
    } else if (now > registrationCloseTime) {
      return 'closed';
    } else {
      return 'open';
    }
  };

  const registrationStatus = getRegistrationStatus();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tournaments.registration')}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {registrationStatus === 'not-open' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('tournaments.registrationNotOpen')}</AlertTitle>
              <AlertDescription>
                {t('tournaments.registrationOpensAt', { 
                  time: new Date(tournament.registration_open_time).toLocaleString() 
                })}
              </AlertDescription>
            </Alert>
          )}
          
          {registrationStatus === 'closed' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('tournaments.registrationClosed')}</AlertTitle>
              <AlertDescription>
                {t('tournaments.registrationClosedAt', { 
                  time: tournament.registration_close_time 
                    ? new Date(tournament.registration_close_time).toLocaleString()
                    : new Date(tournament.start_time).toLocaleString()
                })}
              </AlertDescription>
            </Alert>
          )}
          
          {tournament.is_private && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('tournaments.accessCode')}
              </label>
              <Input 
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder={t('tournaments.enterAccessCode')}
                disabled={registrationStatus !== 'open' || registered || loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                <Lock className="h-3 w-3 inline-block mr-1" />
                {t('tournaments.privateEvent')}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-emerald" />
                <span>
                  {t('tournaments.registeredPlayers', {
                    count: tournament.registered_players_count || 0,
                    total: tournament.max_players
                  })}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('tournaments.minPlayers', { count: tournament.min_players })}
              </p>
            </div>
            
            {registered && (
              <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-sm flex items-center">
                <Check className="h-4 w-4 mr-1" />
                {t('tournaments.registered')}
              </div>
            )}
          </div>
          
          {registered && registration && (
            <div className="p-4 bg-muted/40 rounded-md">
              <h4 className="font-medium mb-2">{t('tournaments.yourRegistration')}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('tournaments.registrationTime')}</p>
                  <p>{new Date(registration.registration_time).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('tournaments.startingChips')}</p>
                  <p>{registration.chips.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        {registrationStatus === 'open' && (
          registered ? (
            <Button 
              variant="outline"
              onClick={handleUnregister} 
              disabled={loading}
              className="w-full text-red-500 hover:bg-red-500/10"
            >
              {t('tournaments.unregister')}
            </Button>
          ) : (
            <Button 
              onClick={handleRegister} 
              disabled={loading || (tournament.is_private && !accessCode)}
              className="w-full"
            >
              {t('tournaments.register')}
            </Button>
          )
        )}
        
        <Button
          variant="outline"
          onClick={toggleRegistrationsList}
          className="w-full"
        >
          {registrationsVisible ? t('hideRegistrations') : t('showRegistrations')}
        </Button>
        
        {registrationsVisible && (
          <div className="w-full">
            <TournamentRegistrationsList 
              registrations={registrations}
              loading={loadingRegistrations}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
