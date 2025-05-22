import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Clock, Calendar, Users, Trophy, Badge as LucideBadge, Copy, User } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Tournament, TournamentRegistration } from '@/types/tournaments';
import { Badge } from '@/components/ui/badge';
import { DEFAULT_TOURNAMENT_FILTERS } from '@/types/tournaments';
import { useAuth } from '@/stores/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accessCode, setAccessCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTournament();
      fetchTournamentRegistrations();
    }
  }, [id]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments_new')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTournament(data as Tournament);
    } catch (error: any) {
      toast({
        title: t('errors.fetchFailed'),
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTournamentRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('*, player_details:player_id(alias, avatar_url)')
        .eq('tournament_id', id);
    
      if (error) throw error;
    
      const processedData = data.map(reg => ({
        ...reg,
        player_name: reg.player_details?.alias || 'Unknown Player',
        player_avatar: reg.player_details?.avatar_url || null
      }));
    
      setRegistrations(processedData);
    } catch (error: any) {
      toast({
        title: t('errors.fetchFailed'),
        description: error.message
      });
    }
  };

  const handleRegistration = async () => {
    if (!user) {
      toast({
        title: t('error'),
        description: t('mustBeLoggedIn'),
        variant: 'destructive',
      });
      return;
    }

    if (!tournament) return;

    if (tournament.is_private && tournament.access_code !== accessCode) {
      toast({
        title: t('error'),
        description: t('tournaments.incorrectAccessCode'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsJoining(true);
      const { data, error } = await supabase
        .from('tournament_registrations')
        .insert([
          {
            tournament_id: tournament.id,
            player_id: user.id,
            registration_time: new Date().toISOString(),
            is_active: true,
            chips: tournament.starting_chips,
            rebuys: 0,
            addons: 0,
          },
        ]);

      if (error) throw error;
      
      toast({
        title: t('tournaments.registrationSuccess'),
        description: t('tournaments.registrationSuccessMessage')
      });
      
      fetchTournamentRegistrations();
    } catch (error: any) {
      toast({
        title: t('tournaments.registrationError'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleUnregistration = async () => {
    if (!user || !tournament) return;

    try {
      setIsJoining(true);
      const { error } = await supabase
        .from('tournament_registrations')
        .delete()
        .eq('tournament_id', tournament.id)
        .eq('player_id', user.id);

      if (error) throw error;

      toast({
        title: t('tournaments.unregistrationSuccess'),
        description: t('tournaments.unregistrationSuccessMessage')
      });
      fetchTournamentRegistrations();
    } catch (error: any) {
      toast({
        title: t('tournaments.unregistrationError'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const isRegistered = () => {
    return registrations.some(reg => reg.player_id === user?.id);
  };

  if (loading) {
    return <div>{t('loading')}...</div>;
  }

  if (!tournament) {
    return <div>{t('tournaments.tournamentNotFound')}</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPp');
  };

  const timeToStart = (startTime: string) => {
    try {
      return formatDistanceToNow(new Date(startTime), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const renderPayoutStructure = () => {
    if (!tournament?.payout_structure) {
      return <div>{t('tournaments.noPayoutStructure')}</div>;
    }

    return (
      <Table>
        <TableCaption>{t('tournaments.payoutStructure')}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t('tournaments.position')}</TableHead>
            <TableHead>{t('tournaments.percentage')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournament.payout_structure.map((payout, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{payout.position}</TableCell>
              <TableCell>{payout.percentage}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderBlindStructure = () => {
    if (!tournament?.blind_structure) {
      return <div>{t('tournaments.noBlindStructure')}</div>;
    }

    return (
      <Table>
        <TableCaption>{t('tournaments.blindStructure')}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t('tournaments.level')}</TableHead>
            <TableHead>{t('tournaments.smallBlind')}</TableHead>
            <TableHead>{t('tournaments.bigBlind')}</TableHead>
            <TableHead>{t('tournaments.ante')}</TableHead>
            <TableHead>{t('tournaments.duration')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournament.blind_structure.map((blind, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{blind.level}</TableCell>
              <TableCell>{blind.small_blind}</TableCell>
              <TableCell>{blind.big_blind}</TableCell>
              <TableCell>{blind.ante}</TableCell>
              <TableCell>{blind.duration_minutes} {t('minutes')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="container py-6">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{tournament.name}</h1>
          <p className="text-muted-foreground">{tournament.description || t('tournaments.noDescription')}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/tournaments', { state: { filters: DEFAULT_TOURNAMENT_FILTERS } })}>
          {t('tournaments.backToTournaments')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 mr-2 text-emerald" />
            <span>{formatDate(tournament.start_time)}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 mr-2 text-emerald" />
            <span>{timeToStart(tournament.start_time)}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 mr-2 text-emerald" />
            <span>
              {registrations.length} / {tournament.max_players} {t('players')}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 mr-2 text-emerald" />
            <span>
              {tournament.buy_in > 0
                ? t('tournaments.buyIn', { amount: tournament.buy_in })
                : t('tournaments.freeroll')}
            </span>
          </div>
          {tournament.prize_pool > 0 && (
            <div className="mt-2 font-medium">
              {t('tournaments.prizePool', { amount: tournament.prize_pool })}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          {tournament.is_private && (
            <div className="mb-4 p-4 border rounded-md">
              <Label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">{t('tournaments.accessCode')}</Label>
              <div className="flex items-center">
                <Input
                  type="text"
                  id="accessCode"
                  className="mt-1 mr-2"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                />
                <Copy
                  className="h-4 w-4 text-gray-500 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(tournament.access_code || '');
                    toast({
                      title: t('copied'),
                      description: t('tournaments.accessCodeCopied'),
                    });
                  }}
                />
              </div>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleRegistration}
            disabled={isRegistered() || isJoining}
          >
            {isRegistered() ? t('tournaments.registered') : t('tournaments.register')}
          </Button>
          {isRegistered() && (
            <Button
              variant="destructive"
              className="w-full mt-2"
              onClick={handleUnregistration}
              disabled={isJoining}
            >
              {t('tournaments.unregister')}
            </Button>
          )}
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="rules">
          <AccordionTrigger>{t('tournaments.rules')}</AccordionTrigger>
          <AccordionContent>
            {tournament.rules || t('tournaments.noRules')}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="payout">
          <AccordionTrigger>{t('tournaments.payoutStructure')}</AccordionTrigger>
          <AccordionContent>
            {renderPayoutStructure()}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="blind">
          <AccordionTrigger>{t('tournaments.blindStructure')}</AccordionTrigger>
          <AccordionContent>
            {renderBlindStructure()}
          </AccordionContent>
        </AccordionItem>
        {registrations.length > 0 && (
          <AccordionItem value="players">
            <AccordionTrigger>{t('tournaments.registeredPlayers')}</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableCaption>{t('tournaments.registeredPlayers')}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('player')}</TableHead>
                    <TableHead>{t('tournaments.registrationTime')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={reg.player_avatar || ''} alt={reg.player_name || 'Player'} />
                          <AvatarFallback>{reg.player_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {reg.player_name}
                      </TableCell>
                      <TableCell>{format(new Date(reg.registration_time), 'PPp')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default TournamentDetail;
