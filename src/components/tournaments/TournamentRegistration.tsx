
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { useTournamentRegistration } from '@/hooks/useTournamentRegistration';

interface TournamentRegistrationProps {
  tournamentId: string;
  maxPlayers: number;
  registrationInfo?: {
    open: boolean;
    startTime: string;
    endTime?: string;
  };
}

type RegistrationPlayer = {
  id: string;
  player_id: string;
  registration_time: string;
  player_name?: string;
  avatar_url?: string;
};

export function TournamentRegistration({ 
  tournamentId, 
  maxPlayers,
  registrationInfo 
}: TournamentRegistrationProps) {
  const { t } = useTranslation();
  const [registrations, setRegistrations] = useState<RegistrationPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const { registerForTournament, unregister, isRegistered, isRegistering } = useTournamentRegistration();
  
  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tournament_registrations')
          .select(`
            id, 
            player_id,
            registration_time
          `)
          .eq('tournament_id', tournamentId)
          .eq('is_active', true);
          
        if (error) throw error;
        
        // Get player info for each registration
        const enrichedData = await Promise.all((data || []).map(async (reg) => {
          const { data: playerData } = await supabase
            .from('profiles')
            .select('alias, avatar_url')
            .eq('id', reg.player_id)
            .single();
            
          return {
            ...reg,
            player_name: playerData?.alias || 'Unknown Player',
            avatar_url: playerData?.avatar_url || undefined
          };
        }));
        
        setRegistrations(enrichedData);
      } catch (err) {
        console.error('Error fetching registrations:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegistrations();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('tournament-registrations')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'tournament_registrations', filter: `tournament_id=eq.${tournamentId}` }, 
        fetchRegistrations
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'tournament_registrations', filter: `tournament_id=eq.${tournamentId}` },
        fetchRegistrations
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournamentId]);
  
  const isRegistrationOpen = registrationInfo?.open ?? true;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {t('registeredPlayers', 'Jugadores Registrados')}
        </h3>
        <Badge variant={isRegistrationOpen ? "outline" : "destructive"}>
          {isRegistrationOpen 
            ? t('registrationOpen', 'Registro Abierto') 
            : t('registrationClosed', 'Registro Cerrado')}
        </Badge>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">
          {registrations.length} / {maxPlayers} {t('players', 'jugadores')}
        </span>
        {isRegistrationOpen && (
          <Button 
            onClick={() => isRegistered 
              ? unregister(tournamentId) 
              : registerForTournament(tournamentId)
            }
            disabled={isRegistering || (!isRegistered && registrations.length >= maxPlayers)}
            variant={isRegistered ? "destructive" : "primary"}
          >
            {isRegistering 
              ? t('processing', 'Procesando...') 
              : isRegistered 
                ? t('unregister', 'Cancelar Registro') 
                : t('register', 'Registrarse')}
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-64 rounded-md border border-gray-700">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">{t('loading', 'Cargando...')}</p>
          </div>
        ) : registrations.length > 0 ? (
          <div className="p-4 space-y-2">
            {registrations.map((registration) => (
              <div 
                key={registration.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={registration.avatar_url} />
                    <AvatarFallback>{registration.player_name?.substring(0, 2) || 'P'}</AvatarFallback>
                  </Avatar>
                  <span>{registration.player_name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(registration.registration_time).toLocaleTimeString([], { 
                    hour: '2-digit', minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">{t('noRegistrations', 'No hay jugadores registrados')}</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
