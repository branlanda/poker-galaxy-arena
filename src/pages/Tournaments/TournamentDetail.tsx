
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { Tournament } from '@/types/tournaments';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TournamentStatusBadge } from '@/components/tournaments/TournamentStatusBadge';
import { TournamentCountdown } from '@/components/tournaments/TournamentCountdown';
import { TournamentRegistration } from '@/components/tournaments/TournamentRegistration';
import { Calendar, Clock, Trophy, Users, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function TournamentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (!id) return;
    
    const fetchTournament = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tournaments_new')
          .select('*, tournament_registrations(count)')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        // Parse blind structure and payout structure
        const blindStructure = typeof data.blind_structure === 'string' 
          ? JSON.parse(data.blind_structure) 
          : data.blind_structure;
          
        const payoutStructure = typeof data.payout_structure === 'string'
          ? JSON.parse(data.payout_structure)
          : data.payout_structure;
        
        setTournament({
          ...data,
          blind_structure: blindStructure,
          payout_structure: payoutStructure,
          registered_players_count: data.tournament_registrations?.[0]?.count || 0
        });
      } catch (err) {
        console.error('Error fetching tournament:', err);
        toast({
          title: t('errors.fetchFailed'),
          description: t('tournaments.notFound'),
          variant: 'destructive',
        });
        navigate('/tournaments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTournament();
    
    // Set up real-time subscription for tournament updates
    const subscription = supabase
      .channel('public:tournaments_new')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tournaments_new', filter: `id=eq.${id}` },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const updatedData = payload.new as any;
            const blindStructure = typeof updatedData.blind_structure === 'string' 
              ? JSON.parse(updatedData.blind_structure) 
              : updatedData.blind_structure;
              
            const payoutStructure = typeof updatedData.payout_structure === 'string'
              ? JSON.parse(updatedData.payout_structure)
              : updatedData.payout_structure;
            
            setTournament(prev => prev ? {
              ...prev,
              ...updatedData,
              blind_structure: blindStructure,
              payout_structure: payoutStructure
            } : null);
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: t('tournaments.deleted'),
              description: t('tournaments.hasBeenDeleted'),
            });
            navigate('/tournaments');
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id]);
  
  const handleRegistrationChange = () => {
    // Refresh tournament data to get updated registration info
    if (!id) return;
    
    const updateTournament = async () => {
      try {
        const { data, error } = await supabase
          .from('tournaments_new')
          .select('*, tournament_registrations(count)')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setTournament(prev => prev ? {
          ...prev,
          ...data,
          registered_players_count: data.tournament_registrations?.[0]?.count || 0
        } : null);
      } catch (err) {
        console.error('Error updating tournament:', err);
      }
    };
    
    updateTournament();
  };
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 border-4 border-t-transparent border-emerald rounded-full animate-spin"></div>
            <p>{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!tournament) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p>{t('tournaments.notFound')}</p>
            <Button onClick={() => navigate('/tournaments')} className="mt-4">
              {t('goBack')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/tournaments')} 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('tournaments.backToLobby')}
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{tournament.name}</h1>
              <TournamentStatusBadge status={tournament.status} />
            </div>
            <p className="text-muted-foreground">{tournament.description || t('tournaments.noDescription')}</p>
          </div>
          
          {tournament.banner_url && (
            <img 
              src={tournament.banner_url} 
              alt={tournament.name} 
              className="w-full md:w-40 h-24 object-cover rounded"
            />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">{t('tournaments.overview')}</TabsTrigger>
              <TabsTrigger value="structure">{t('tournaments.structure')}</TabsTrigger>
              <TabsTrigger value="rules">{t('tournaments.rules')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('tournaments.info')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('tournaments.type')}</p>
                        <p className="font-medium">{t(`tournaments.types.${tournament.tournament_type.toLowerCase()}`)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('tournaments.buyIn')}</p>
                        <p className="font-medium">
                          {tournament.buy_in > 0 
                            ? `${tournament.buy_in} USDT`
                            : t('tournaments.freeroll')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('tournaments.startingChips')}</p>
                        <p className="font-medium">{tournament.starting_chips.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('tournaments.prizePool')}</p>
                        <p className="font-medium">
                          {tournament.prize_pool > 0 
                            ? `${tournament.prize_pool.toLocaleString()} USDT`
                            : t('tournaments.dynamic')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('time.date')}</p>
                        <p className="font-medium">{format(new Date(tournament.start_time), 'PPP')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('time.time')}</p>
                        <p className="font-medium">{format(new Date(tournament.start_time), 'p')}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('tournaments.rebuyAllowed')}</p>
                        <p className="font-medium">{tournament.rebuy_allowed ? t('yes') : t('no')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('tournaments.addonAllowed')}</p>
                        <p className="font-medium">{tournament.addon_allowed ? t('yes') : t('no')}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('tournaments.lateRegistration')}</p>
                        <p className="font-medium">
                          {tournament.late_registration_minutes
                            ? t('tournaments.minutes', { count: tournament.late_registration_minutes })
                            : t('no')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('tournaments.players')}</p>
                        <p className="font-medium">
                          {tournament.min_players} - {tournament.max_players}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <TournamentCountdown startTime={tournament.start_time} />
              </div>
              
              {tournament.status === 'COMPLETED' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('tournaments.results')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Results would go here when implemented */}
                    <p className="text-center text-muted-foreground py-4">
                      {t('tournaments.resultsNotAvailable')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('tournaments.payouts')}</CardTitle>
                    <CardDescription>{t('tournaments.estimatedPayouts')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tournament.payout_structure.length > 0 ? (
                      <div className="space-y-2">
                        {tournament.payout_structure.slice(0, 10).map((payout, index) => (
                          <div key={index} className="flex justify-between py-1 border-b last:border-0">
                            <div className="flex items-center">
                              <Trophy className={`h-4 w-4 mr-2 ${index < 3 ? 'text-emerald' : 'text-muted-foreground'}`} />
                              <span>{t('tournaments.position', { position: payout.position })}</span>
                            </div>
                            <div className="font-medium">{payout.percentage}%</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        {t('tournaments.payoutStructureNotDefined')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="structure">
              <Card>
                <CardHeader>
                  <CardTitle>{t('tournaments.blindStructure')}</CardTitle>
                  <CardDescription>{t('tournaments.blindLevels')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">{t('tournaments.level')}</th>
                          <th className="text-right py-2 px-4">{t('tournaments.smallBlind')}</th>
                          <th className="text-right py-2 px-4">{t('tournaments.bigBlind')}</th>
                          <th className="text-right py-2 px-4">{t('tournaments.ante')}</th>
                          <th className="text-right py-2 px-4">{t('tournaments.duration')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tournament.blind_structure.length > 0 ? (
                          tournament.blind_structure.map((level, index) => (
                            <tr key={index} className={`border-b ${tournament.current_level === level.level ? 'bg-emerald-500/10' : ''}`}>
                              <td className="py-3 px-4">{level.level}</td>
                              <td className="text-right py-3 px-4">{level.small_blind}</td>
                              <td className="text-right py-3 px-4">{level.big_blind}</td>
                              <td className="text-right py-3 px-4">{level.ante}</td>
                              <td className="text-right py-3 px-4">
                                {t('tournaments.minutes', { count: level.duration_minutes })}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-4 text-muted-foreground">
                              {t('tournaments.blindStructureNotDefined')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>{t('tournaments.rules')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.rules ? (
                    <div className="prose max-w-none dark:prose-invert">
                      <p>{tournament.rules}</p>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      {t('tournaments.rulesNotDefined')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          {user ? (
            <TournamentRegistration 
              tournament={tournament} 
              onRegistrationChange={handleRegistrationChange}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('tournaments.registration')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="mb-4">{t('tournaments.loginToRegister')}</p>
                  <Button onClick={() => navigate('/login')}>
                    {t('login')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
