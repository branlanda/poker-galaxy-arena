
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';
import { Tournament, TournamentRegistration, BlindLevel, PayoutLevel } from '@/types/tournaments';
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
              
              setTournament(updatedTournament);
            } else if (payload.eventType === 'DELETE') {
              toast({
                title: t('tournaments.deleted'),
                description: t('tournaments.noLongerAvailable'),
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
      
      // Parse JSON fields
      const blindStructure: BlindLevel[] = typeof data.blind_structure === 'string' 
        ? JSON.parse(data.blind_structure) 
        : data.blind_structure || [];
        
      const payoutStructure: PayoutLevel[] = typeof data.payout_structure === 'string'
        ? JSON.parse(data.payout_structure)
        : data.payout_structure || [];
      
      const parsedTournament = {
        ...data,
        blind_structure: blindStructure,
        payout_structure: payoutStructure
      } as Tournament;
      
      setTournament(parsedTournament);
    } catch (err: any) {
      console.error('Error fetching tournament:', err);
      toast({
        title: t('errors.fetchFailed'),
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
      setAccessCodeError(t('tournaments.invalidAccessCode'));
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
          title: t('errors.tournamentStarted'),
          description: t('errors.cannotRegisterAfterStart'),
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
        title: t('tournaments.registrationSuccess'),
        description: t('tournaments.registeredForTournament', { 
          name: tournament.name 
        }),
      });
      
      fetchRegistrations();
    } catch (err: any) {
      console.error('Error registering for tournament:', err);
      toast({
        title: t('errors.registrationFailed'),
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
          title: t('errors.tournamentStarted'),
          description: t('errors.cannotUnregisterAfterStart'),
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
        title: t('tournaments.unregisteredSuccess'),
        description: t('tournaments.unregisteredFromTournament', { 
          name: tournament.name 
        }),
      });
      
      fetchRegistrations();
      setUnregisterDialogOpen(false);
    } catch (err: any) {
      console.error('Error unregistering from tournament:', err);
      toast({
        title: t('errors.unregistrationFailed'),
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
        <p>{t('loading')}</p>
      </div>
    );
  }
  
  if (!tournament) {
    return (
      <div className="container py-8">
        <Button variant="outline" onClick={() => navigate('/tournaments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Button>
        <div className="mt-8 text-center">
          <p>{t('tournaments.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" onClick={() => navigate('/tournaments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
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
                  {t('private')}
                </div>
              )}
            </div>
            
            {!userRegistration ? (
              <Button 
                onClick={handleRegisterClick}
                disabled={tournament.status !== 'SCHEDULED' && tournament.status !== 'REGISTERING'}
              >
                {t('tournaments.register')}
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setUnregisterDialogOpen(true)}
                disabled={tournament.status !== 'SCHEDULED' && tournament.status !== 'REGISTERING'}
              >
                {t('tournaments.unregister')}
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
                    {t('tournaments.startDate')}
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
                    {t('tournaments.registration')}
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
                    {t('tournaments.players')}
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
                    {t('tournaments.buyIn')}
                  </div>
                  <div className="font-medium text-center mt-1">
                    {tournament.buy_in > 0 
                      ? tournament.buy_in.toLocaleString()
                      : t('tournaments.free')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">
                {t('tournaments.information')}
              </TabsTrigger>
              <TabsTrigger value="structure">
                {t('tournaments.structure')}
              </TabsTrigger>
              <TabsTrigger value="players">
                {t('tournaments.players')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('tournaments.description')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{tournament.description || t('tournaments.noDescription')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('tournaments.details')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.type')}:</div>
                    <div>{tournament.tournament_type}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.startingChips')}:</div>
                    <div>{tournament.starting_chips.toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.lateRegistration')}:</div>
                    <div>
                      {tournament.late_registration_minutes 
                        ? t('tournaments.minutes', { minutes: tournament.late_registration_minutes })
                        : t('tournaments.none')}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.rebuys')}:</div>
                    <div>{tournament.rebuy_allowed ? t('yes') : t('no')}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.addons')}:</div>
                    <div>{tournament.addon_allowed ? t('yes') : t('no')}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">{t('tournaments.prizePool')}:</div>
                    <div>
                      {tournament.prize_pool > 0 
                        ? tournament.prize_pool.toLocaleString()
                        : t('tournaments.tbd')}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {tournament.rules && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('tournaments.rules')}</CardTitle>
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
                  <CardTitle>{t('tournaments.blindStructure')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.blind_structure && tournament.blind_structure.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">{t('tournaments.level')}</th>
                            <th className="text-left py-2">{t('tournaments.blinds')}</th>
                            <th className="text-left py-2">{t('tournaments.ante')}</th>
                            <th className="text-left py-2">{t('tournaments.duration')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tournament.blind_structure.map((level: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{level.level}</td>
                              <td className="py-2">{level.small_blind}/{level.big_blind}</td>
                              <td className="py-2">{level.ante || 0}</td>
                              <td className="py-2">
                                {t('tournaments.minutes', { minutes: level.duration_minutes })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>{t('tournaments.noBlindStructure')}</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('tournaments.payoutStructure')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.payout_structure && tournament.payout_structure.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">{t('tournaments.position')}</th>
                            <th className="text-left py-2">{t('tournaments.percentage')}</th>
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
                    <p>{t('tournaments.noPayoutStructure')}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="players">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('tournaments.registeredPlayers')}{' '}
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
                <CardTitle>{t('tournaments.registered')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{t('tournaments.registrationConfirmed')}</p>
                
                <div className="p-4 bg-background/40 rounded-md">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">{t('tournaments.startingStack')}</div>
                    <div className="text-2xl font-bold mt-1">{userRegistration.chips.toLocaleString()}</div>
                  </div>
                </div>
                
                {tournament.status !== 'SCHEDULED' && tournament.status !== 'REGISTERING' ? (
                  <Button className="w-full">
                    {t('tournaments.goToTournament')}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setUnregisterDialogOpen(true)}
                  >
                    {t('tournaments.unregister')}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>{t('tournaments.howToPlay')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <HelpCircle className="h-5 w-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{t('tournaments.register')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('tournaments.howToRegister')}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <HelpCircle className="h-5 w-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{t('tournaments.join')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('tournaments.howToJoin')}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <HelpCircle className="h-5 w-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{t('tournaments.play')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('tournaments.howToWin')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {tournament.prize_pool > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('tournaments.prizePool')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-center text-emerald">
                  {tournament.prize_pool.toLocaleString()}
                </div>
                
                {tournament.payout_structure && tournament.payout_structure.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">{t('tournaments.topPrizes')}</h4>
                    <div className="space-y-2">
                      {tournament.payout_structure.slice(0, 3).map((payout: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>{t('tournaments.position')} {payout.position}</div>
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
            <DialogTitle>{t('tournaments.privateRegistration')}</DialogTitle>
            <DialogDescription>
              {t('tournaments.privateCodeRequired')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleRegisterSubmit(); }}>
            <Input
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value);
                setAccessCodeError('');
              }}
              placeholder={t('tournaments.accessCode')}
              className="mb-4"
            />
            {accessCodeError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{accessCodeError}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRegisterDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit">
                {t('tournaments.register')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Unregister Confirmation Dialog */}
      <Dialog open={unregisterDialogOpen} onOpenChange={setUnregisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tournaments.confirmUnregister')}</DialogTitle>
            <DialogDescription>
              {t('tournaments.unregisterConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setUnregisterDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="button" onClick={handleUnregister}>
              {t('tournaments.unregister')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
