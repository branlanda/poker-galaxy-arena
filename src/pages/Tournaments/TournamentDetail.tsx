
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';
import { Tournament, TournamentRegistration } from '@/types/tournaments';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TournamentCountdown, TournamentStatusBadge, TournamentRegistrationsList } from '@/components/tournaments';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Trophy, Calendar, Clock, HelpCircle, Lock } from 'lucide-react';
import { format } from 'date-fns';

export function TournamentDetail() {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [userRegistration, setUserRegistration] = useState<TournamentRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [unregisterDialogOpen, setUnregisterDialogOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [accessCodeError, setAccessCodeError] = useState('');
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!id) return;
    fetchTournament();
    
    // Set up realtime subscription for tournament updates
    const tournamentChannel = supabase
      .channel(`tournament_${id}`)
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'tournaments_new', filter: `id=eq.${id}` },
          (payload) => {
            if (payload.eventType === 'UPDATE') {
              setTournament(payload.new as Tournament);
            } else if (payload.eventType === 'DELETE') {
              toast({
                title: t('tournaments.deleted', 'Tournament Deleted'),
                description: t('tournaments.noLongerAvailable', 'This tournament is no longer available'),
                variant: 'destructive',
              });
              navigate('/tournaments');
            }
          })
      .subscribe();
      
    // Set up realtime subscription for registration updates
    const registrationsChannel = supabase
      .channel(`tournament_registrations_${id}`)
      .on('postgres_changes',
          { event: '*', schema: 'public', table: 'tournament_registrations', filter: `tournament_id=eq.${id}` },
          () => {
            fetchRegistrations();
            if (user) checkUserRegistration();
          })
      .subscribe();
      
    return () => {
      supabase.removeChannel(tournamentChannel);
      supabase.removeChannel(registrationsChannel);
    };
  }, [id]);
  
  useEffect(() => {
    if (tournament && user) {
      checkUserRegistration();
      fetchRegistrations();
    }
  }, [tournament, user]);
  
  const fetchTournament = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments_new')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      setTournament(data);
    } catch (err: any) {
      console.error('Error fetching tournament:', err);
      toast({
        title: t('errors.fetchFailed', 'Failed to fetch tournament'),
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRegistrations = async () => {
    if (!id) return;
    
    try {
      setRegistrationsLoading(true);
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('*, profiles:player_id(alias, avatar_url)')
        .eq('tournament_id', id)
        .order('registration_time', { ascending: true });
        
      if (error) throw error;
      
      // Process registrations to include player names
      const processedData = data.map(reg => ({
        ...reg,
        player_name: reg.profiles?.alias || 'Unknown Player',
        player_avatar: reg.profiles?.avatar_url || undefined
      }));
      
      setRegistrations(processedData);
    } catch (err: any) {
      console.error('Error fetching registrations:', err);
    } finally {
      setRegistrationsLoading(false);
    }
  };
  
  const checkUserRegistration = async () => {
    if (!user || !id) return;
    
    try {
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('*')
        .eq('tournament_id', id)
        .eq('player_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        console.error('Error checking registration:', error);
      }
      
      setUserRegistration(data || null);
    } catch (err) {
      console.error('Error checking user registration:', err);
    }
  };
  
  const handleRegisterClick = () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/tournaments/${id}` } });
      return;
    }
    
    if (tournament?.is_private) {
      setRegisterDialogOpen(true);
      return;
    }
    
    registerForTournament();
  };
  
  const handleRegisterSubmit = () => {
    if (tournament?.is_private && tournament.access_code !== accessCode) {
      setAccessCodeError(t('tournaments.invalidAccessCode', 'Invalid access code'));
      return;
    }
    
    registerForTournament();
    setRegisterDialogOpen(false);
  };
  
  const registerForTournament = async () => {
    if (!user || !tournament) return;
    
    try {
      const now = new Date();
      const startTime = new Date(tournament.start_time);
      
      if (now >= startTime) {
        toast({
          title: t('errors.tournamentStarted', 'Tournament started'),
          description: t('errors.cannotRegisterAfterStart', 'Cannot register for a tournament that has already started'),
          variant: 'destructive',
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('tournament_registrations')
        .insert({
          tournament_id: tournament.id,
          player_id: user.id,
          chips: tournament.starting_chips,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setUserRegistration(data);
      
      toast({
        title: t('tournaments.registrationSuccess', 'Registration successful'),
        description: t('tournaments.registeredForTournament', 'You are now registered for {name}', { 
          name: tournament.name 
        }),
      });
      
      fetchRegistrations();
    } catch (err: any) {
      console.error('Error registering for tournament:', err);
      toast({
        title: t('errors.registrationFailed', 'Registration failed'),
        description: err.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleUnregister = async () => {
    if (!user || !tournament) return;
    
    try {
      const now = new Date();
      const startTime = new Date(tournament.start_time);
      
      if (now >= startTime) {
        toast({
          title: t('errors.tournamentStarted', 'Tournament started'),
          description: t('errors.cannotUnregisterAfterStart', 'Cannot unregister from a tournament that has already started'),
          variant: 'destructive',
        });
        setUnregisterDialogOpen(false);
        return;
      }
      
      const { error } = await supabase
        .from('tournament_registrations')
        .delete()
        .eq('tournament_id', tournament.id)
        .eq('player_id', user.id);
        
      if (error) throw error;
      
      setUserRegistration(null);
      
      toast({
        title: t('tournaments.unregisteredSuccess', 'Unregistered successfully'),
        description: t('tournaments.unregisteredFromTournament', 'You have been unregistered from {name}', { 
          name: tournament.name 
        }),
      });
      
      fetchRegistrations();
      setUnregisterDialogOpen(false);
    } catch (err: any) {
      console.error('Error unregistering from tournament:', err);
      toast({
        title: t('errors.unregistrationFailed', 'Unregistration failed'),
        description: err.message,
        variant: 'destructive',
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPp');
    } catch (e) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <p>{t('loading', 'Loading...')}</p>
      </div>
    );
  }
  
  if (!tournament) {
    return (
      <div className="container py-8">
        <Button variant="outline" onClick={() => navigate('/tournaments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back', 'Back')}
        </Button>
        <div className="mt-8 text-center">
          <p>{t('tournaments.notFound', 'Tournament not found')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" onClick={() => navigate('/tournaments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back', 'Back')}
        </Button>
        <TournamentStatusBadge status={tournament.status} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">{tournament.name}</h1>
              {tournament.is_private && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Lock className="h-3 w-3" />
                  {t('private', 'Private')}
                </div>
              )}
            </div>
            
            {!userRegistration ? (
              <Button 
                onClick={handleRegisterClick}
                disabled={tournament.status !== 'SCHEDULED' && tournament.status !== 'REGISTERING'}
              >
                {t('tournaments.register', 'Register')}
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setUnregisterDialogOpen(true)}
                disabled={tournament.status !== 'SCHEDULED' && tournament.status !== 'REGISTERING'}
              >
                {t('tournaments.unregister', 'Unregister')}
              </Button>
            )}
          </div>
          
          {tournament.status === 'SCHEDULED' || tournament.status === 'REGISTERING' ? (
            <TournamentCountdown startTime={tournament.start_time} />
          ) : null}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Calendar className="h-5 w-5 text-emerald mb-1" />
                  <div className="text-xs text-muted-foreground">
                    {t('tournaments.startDate', 'Start Date')}
                  </div>
                  <div className="font-medium text-center mt-1">
                    {formatDate(tournament.start_time)}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-emerald mb-1" />
                  <div className="text-xs text-muted-foreground">
                    {t('tournaments.registration', 'Registration')}
                  </div>
                  <div className="font-medium text-center mt-1">
                    {formatDate(tournament.registration_open_time)}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Users className="h-5 w-5 text-emerald mb-1" />
                  <div className="text-xs text-muted-foreground">
                    {t('tournaments.players', 'Players')}
                  </div>
                  <div className="font-medium text-center mt-1">
                    {registrations.length} / {tournament.max_players}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Trophy className="h-5 w-5 text-emerald mb-1" />
                  <div className="text-xs text-muted-foreground">
                    {t('tournaments.buyIn', 'Buy-in')}
                  </div>
                  <div className="font-medium text-center mt-1">
                    {tournament.buy_in > 0 
                      ? tournament.buy_in.toLocaleString()
                      : t('tournaments.free', 'Free')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">
                {t('tournaments.information', 'Information')}
              </TabsTrigger>
              <TabsTrigger value="structure">
                {t('tournaments.structure', 'Structure')}
              </TabsTrigger>
              <TabsTrigger value="players">
                {t('tournaments.players', 'Players')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('tournaments.description', 'Description')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{tournament.description || t('tournaments.noDescription', 'No description provided')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('tournaments.details', 'Tournament Details')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.type', 'Type')}:</div>
                    <div>{tournament.tournament_type}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.startingChips', 'Starting Chips')}:</div>
                    <div>{tournament.starting_chips.toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.lateRegistration', 'Late Registration')}:</div>
                    <div>
                      {tournament.late_registration_minutes 
                        ? t('tournaments.minutes', '{minutes} minutes', { minutes: tournament.late_registration_minutes })
                        : t('tournaments.none', 'None')}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.rebuys', 'Rebuys')}:</div>
                    <div>{tournament.rebuy_allowed ? t('yes', 'Yes') : t('no', 'No')}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.addons', 'Add-ons')}:</div>
                    <div>{tournament.addon_allowed ? t('yes', 'Yes') : t('no', 'No')}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.prizePool', 'Prize Pool')}:</div>
                    <div>
                      {tournament.prize_pool > 0 
                        ? tournament.prize_pool.toLocaleString()
                        : t('tournaments.tbd', 'TBD')}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {tournament.rules && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('tournaments.rules', 'Rules')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{tournament.rules}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="structure" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('tournaments.blindStructure', 'Blind Structure')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.blind_structure && tournament.blind_structure.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">{t('tournaments.level', 'Level')}</th>
                            <th className="text-left py-2">{t('tournaments.blinds', 'Blinds')}</th>
                            <th className="text-left py-2">{t('tournaments.ante', 'Ante')}</th>
                            <th className="text-left py-2">{t('tournaments.duration', 'Duration')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tournament.blind_structure.map((level: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{level.level}</td>
                              <td className="py-2">{level.small_blind}/{level.big_blind}</td>
                              <td className="py-2">{level.ante || 0}</td>
                              <td className="py-2">
                                {t('tournaments.minutes', '{minutes} minutes', { minutes: level.duration_minutes })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>{t('tournaments.noBlindStructure', 'No blind structure provided')}</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('tournaments.payoutStructure', 'Payout Structure')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.payout_structure && tournament.payout_structure.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">{t('tournaments.position', 'Position')}</th>
                            <th className="text-left py-2">{t('tournaments.percentage', 'Percentage')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tournament.payout_structure.map((payout: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{payout.position}</td>
                              <td className="py-2">{payout.percentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>{t('tournaments.noPayoutStructure', 'No payout structure provided')}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="players">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('tournaments.registeredPlayers', 'Registered Players')}{' '}
                    <span className="text-muted-foreground">
                      ({registrations.length}/{tournament.max_players})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TournamentRegistrationsList
                    registrations={registrations}
                    loading={registrationsLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {userRegistration && (
            <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
              <CardHeader>
                <CardTitle>{t('tournaments.registered', 'You are registered!')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{t('tournaments.registrationConfirmed', 'Your registration for this tournament is confirmed.')}</p>
                
                <div className="p-4 bg-background/40 rounded-md">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">{t('tournaments.startingStack', 'Your Starting Stack')}</div>
                    <div className="text-2xl font-bold mt-1">{userRegistration.chips.toLocaleString()}</div>
                  </div>
                </div>
                
                {tournament.status !== 'SCHEDULED' && tournament.status !== 'REGISTERING' ? (
                  <Button className="w-full">
                    {t('tournaments.goToTournament', 'Go to Tournament')}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setUnregisterDialogOpen(true)}
                  >
                    {t('tournaments.unregister', 'Unregister')}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>{t('tournaments.howToPlay', 'How to Play')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <HelpCircle className="h-5 w-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{t('tournaments.register', 'Register')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('tournaments.howToRegister', 'Sign up for this tournament to secure your seat.')}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <HelpCircle className="h-5 w-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{t('tournaments.join', 'Join when it starts')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('tournaments.howToJoin', 'Return to this page when the tournament starts to join your table.')}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <HelpCircle className="h-5 w-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{t('tournaments.play', 'Play to win')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('tournaments.howToWin', 'The tournament continues until one player has all the chips!')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {tournament.prize_pool > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('tournaments.prizePool', 'Prize Pool')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-center text-emerald">
                  {tournament.prize_pool.toLocaleString()}
                </div>
                
                {tournament.payout_structure && tournament.payout_structure.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">{t('tournaments.topPrizes', 'Top Prizes')}</h4>
                    <div className="space-y-2">
                      {tournament.payout_structure.slice(0, 3).map((payout: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>{t('tournaments.position', 'Position')} {payout.position}</div>
                          <div className="font-medium">
                            {(tournament.prize_pool * (payout.percentage / 100)).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Registration Dialog for Private Tournaments */}
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tournaments.privateRegistration', 'Private Tournament')}</DialogTitle>
            <DialogDescription>
              {t('tournaments.privateCodeRequired', 'This is a private tournament. Please enter the access code to register.')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleRegisterSubmit(); }}>
            <Input
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value);
                setAccessCodeError('');
              }}
              placeholder={t('tournaments.accessCode', 'Access code')}
              className="mb-4"
            />
            {accessCodeError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{accessCodeError}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRegisterDialogOpen(false)}>
                {t('cancel', 'Cancel')}
              </Button>
              <Button type="submit">
                {t('tournaments.register', 'Register')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Unregister Confirmation Dialog */}
      <Dialog open={unregisterDialogOpen} onOpenChange={setUnregisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tournaments.confirmUnregister', 'Confirm Unregistration')}</DialogTitle>
            <DialogDescription>
              {t('tournaments.unregisterConfirm', 'Are you sure you want to unregister from this tournament?')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setUnregisterDialogOpen(false)}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button type="button" variant="destructive" onClick={handleUnregister}>
              {t('tournaments.unregister', 'Unregister')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
