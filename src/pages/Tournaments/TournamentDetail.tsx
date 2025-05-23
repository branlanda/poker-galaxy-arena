import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  Tournament, 
  TournamentRegistration,
  TournamentTable, 
  TournamentSeat
} from '@/types/tournaments';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/stores/auth';
import { TournamentCountdown } from '@/components/tournaments/TournamentCountdown';
import { TournamentStatusBadge } from '@/components/tournaments/TournamentStatusBadge';
import { TournamentRegistration as TournamentRegComponent } from '@/components/tournaments/TournamentRegistration';
import { TournamentRegistrationsList } from '@/components/tournaments/TournamentRegistrationsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  Trophy, 
  Users, 
  Clock, 
  Share2, 
  FileText,
  Table
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ShareTournamentDialog } from './components/ShareTournamentDialog';
import { TournamentBracket } from '@/components/tournaments/TournamentBracket';
import { TournamentChat } from '@/components/tournaments/TournamentChat';

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [tournamentTables, setTournamentTables] = useState<TournamentTable[]>([]);

  // Function to fetch tournament details and registrations
  const fetchTournamentDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Fetch tournament details
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments_new')
        .select('*')
        .eq('id', id)
        .single();
      
      if (tournamentError) {
        throw tournamentError;
      }
      
      // Parse JSON fields
      const tournament: Tournament = {
        ...tournamentData,
        blind_structure: typeof tournamentData.blind_structure === 'string' 
          ? JSON.parse(tournamentData.blind_structure) 
          : tournamentData.blind_structure,
        payout_structure: typeof tournamentData.payout_structure === 'string' 
          ? JSON.parse(tournamentData.payout_structure) 
          : tournamentData.payout_structure,
      };
      
      setTournament(tournament);
      
      // Fetch registrations with player info
      const { data: regData, error: regError } = await supabase
        .from('tournament_registrations')
        .select(`
          *,
          profiles:player_id (alias, avatar_url)
        `)
        .eq('tournament_id', id)
        .order('registration_time');
      
      if (regError) {
        throw regError;
      }
      
      // Format data to include player names and avatars
      const formattedRegistrations = (regData || []).map(reg => ({
        ...reg,
        player_name: reg.profiles?.alias || 'Unknown Player',
        player_avatar: reg.profiles?.avatar_url
      }));
      
      setRegistrations(formattedRegistrations);
      
      // Fetch tournament tables if tournament is running
      if (tournamentData.status === 'RUNNING' || tournamentData.status === 'FINAL_TABLE') {
        const { data: tablesData, error: tablesError } = await supabase
          .from('tournament_tables')
          .select(`
            *,
            seats:tournament_seats (
              *,
              profiles:player_id (alias, avatar_url)
            )
          `)
          .eq('tournament_id', id);
        
        if (tablesError) {
          throw tablesError;
        }
        
        // Format data to include player names and avatars in seats
        const formattedTables = (tablesData || []).map(table => ({
          ...table,
          seats: table.seats?.map(seat => ({
            ...seat,
            player_name: seat.profiles?.alias || 'Unknown Player',
            player_avatar: seat.profiles?.avatar_url
          }))
        }));
        
        setTournamentTables(formattedTables);
      }
      
    } catch (error: any) {
      console.error('Error fetching tournament details:', error);
      toast({
        title: t('errors.fetchFailed'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh tournament details when tournament status changes
  const setupTournamentSubscription = () => {
    if (!id) return;

    const channel = supabase
      .channel(`tournament_${id}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'tournaments_new', filter: `id=eq.${id}` },
        (payload) => {
          console.log('Tournament updated:', payload);
          fetchTournamentDetails();
        }
      )
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  };

  useEffect(() => {
    fetchTournamentDetails();
    const cleanupSubscription = setupTournamentSubscription();
    
    return () => {
      cleanupSubscription();
    };
  }, [id]);

  const handleRegistrationChange = () => {
    fetchTournamentDetails();
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  const renderPrizeDistribution = () => {
    if (!tournament) return null;
    
    const totalPrize = tournament.prize_pool > 0 ? tournament.prize_pool : 
      tournament.buy_in * registrations.length * ((100 - tournament.fee_percent) / 100);
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 text-amber-400 mr-2" />
            {t('tournaments.prizeDistribution')}
          </CardTitle>
          <CardDescription>
            {t('tournaments.totalPrizePool')}: {Math.round(totalPrize * 100) / 100} USDT
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tournament.payout_structure.length > 0 ? (
            <div className="space-y-3">
              {tournament.payout_structure.map((payout, index) => (
                <div key={index} className="flex justify-between items-center bg-navy/20 px-4 py-2 rounded-md">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-amber-500/10 text-amber-400 border-amber-500/30">
                      {t('tournaments.position')} {payout.position}
                    </Badge>
                    <span>{payout.percentage}%</span>
                  </div>
                  <span className="font-medium">
                    {Math.round((payout.percentage / 100) * totalPrize * 100) / 100} USDT
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {t('tournaments.noPrizeStructure')}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderBlindStructure = () => {
    if (!tournament) return null;
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 text-emerald mr-2" />
            {t('tournaments.blindStructure')}
          </CardTitle>
          <CardDescription>
            {t('tournaments.blindLevels')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tournament.blind_structure.length > 0 ? (
            <div className="space-y-2">
              {tournament.blind_structure.map((level, index) => {
                const isCurrentLevel = tournament.current_level === level.level;
                return (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center px-4 py-2 rounded-md ${
                      isCurrentLevel ? 'bg-emerald/10 border border-emerald/30' : 'bg-navy/20'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium flex items-center">
                        {isCurrentLevel && (
                          <Badge variant="outline" className="mr-2 bg-emerald/20 border-emerald/50">
                            {t('tournaments.current')}
                          </Badge>
                        )}
                        {t('tournaments.level')} {level.level}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {level.duration_minutes} {t('tournaments.minutes')}
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="font-medium">
                        {level.small_blind}/{level.big_blind}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('tournaments.blinds')}
                      </div>
                    </div>
                    {level.ante > 0 && (
                      <div className="flex-1 text-right">
                        <div className="font-medium">
                          {level.ante}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t('tournaments.ante')}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {t('tournaments.noBlindStructure')}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTournamentTables = () => {
    if (!tournament || tournamentTables.length === 0) return null;
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Table className="h-5 w-5 text-emerald mr-2" />
            {t('tournaments.activeTables')}
          </CardTitle>
          <CardDescription>
            {tournamentTables.length} {t('tournaments.tablesActive')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tournamentTables.map(table => (
              <Card key={table.id} className={table.is_final_table ? 'border-amber-500/50' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {t('tournaments.table')} {table.table_number}
                      {table.is_final_table && (
                        <Badge variant="outline" className="ml-2 bg-amber-500/10 border-amber-500/30 text-amber-400">
                          {t('tournaments.finalTable')}
                        </Badge>
                      )}
                    </CardTitle>
                    <Badge variant="outline" className={
                      table.status === 'WAITING' ? 'bg-blue-500/10 text-blue-500' :
                      table.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' :
                      'bg-gray-500/10 text-gray-500'
                    }>
                      {table.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {Array.from({ length: table.max_seats }).map((_, seatIndex) => {
                      const seatNumber = seatIndex + 1;
                      const occupiedSeat = table.seats?.find(s => s.seat_number === seatNumber);
                      
                      return (
                        <div 
                          key={seatNumber} 
                          className={`p-2 rounded-md text-center ${
                            occupiedSeat ? 'bg-navy/40 border border-navy/60' : 'bg-navy/20'
                          }`}
                        >
                          <div className="text-xs text-muted-foreground">
                            {t('tournaments.seat')} {seatNumber}
                          </div>
                          {occupiedSeat ? (
                            <div className="font-medium truncate">
                              {occupiedSeat.player_name}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              {t('tournaments.empty')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center">
          <div className="w-24 h-24 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('tournaments.notFound')}</h1>
        <p className="mb-6">{t('tournaments.notFoundDescription')}</p>
        <Button onClick={() => navigate('/tournaments')}>
          {t('tournaments.backToLobby')}
        </Button>
      </div>
    );
  }

  const isRegistrationOpen = 
    new Date() >= new Date(tournament.registration_open_time) && 
    (!tournament.registration_close_time || new Date() < new Date(tournament.registration_close_time));
  
  const isTournamentStarted = 
    tournament.status === 'RUNNING' || 
    tournament.status === 'BREAK' ||
    tournament.status === 'FINAL_TABLE';

  return (
    <div className="container py-6">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate('/tournaments')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('tournaments.backToLobby')}
      </Button>
      
      <div className="flex flex-col-reverse md:flex-row gap-8">
        {/* Main tournament details */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TournamentStatusBadge status={tournament.status} />
                {tournament.is_featured && (
                  <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    {t('tournaments.featured')}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold">{tournament.name}</h1>
              <p className="text-muted-foreground mt-1">{tournament.description}</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {t('share')}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">
                {t('tournaments.information')}
              </TabsTrigger>
              <TabsTrigger value="registrations">
                {t('tournaments.registrations')} ({registrations.length})
              </TabsTrigger>
              {isTournamentStarted && (
                <TabsTrigger value="bracket">
                  {t('tournaments.bracket')}
                </TabsTrigger>
              )}
              {isTournamentStarted && (
                <TabsTrigger value="chat">
                  {t('tournaments.chat')}
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {t('tournaments.date')}
                        </div>
                        <div className="font-medium">
                          {format(new Date(tournament.start_time), 'PPP')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {t('tournaments.time')}
                        </div>
                        <div className="font-medium">
                          {format(new Date(tournament.start_time), 'p')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {t('tournaments.players')}
                        </div>
                        <div className="font-medium">
                          {registrations.length} / {tournament.max_players} ({t('tournaments.min')}: {tournament.min_players})
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Trophy className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {t('tournaments.buyIn')}
                        </div>
                        <div className="font-medium">
                          {tournament.buy_in > 0 
                            ? `${tournament.buy_in} USDT ${tournament.fee_percent > 0 ? `+ ${tournament.fee_percent}%` : ''}`
                            : t('tournaments.freeroll')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {t('tournaments.startingChips')}
                        </div>
                        <div className="font-medium">
                          {tournament.starting_chips.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <TournamentCountdown 
                  startTime={tournament.start_time} 
                  onStart={fetchTournamentDetails}
                />
              </div>
              
              {/* Tournament Rules */}
              {tournament.rules && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>
                      <FileText className="h-5 w-5 inline mr-2" />
                      {t('tournaments.rules')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-line">{tournament.rules}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {renderBlindStructure()}
              {renderPrizeDistribution()}
              {renderTournamentTables()}
            </TabsContent>
            
            <TabsContent value="registrations">
              <TournamentRegistrationsList 
                registrations={registrations}
              />
            </TabsContent>
            
            {isTournamentStarted && (
              <TabsContent value="bracket">
                <TournamentBracket 
                  tournamentId={tournament.id}
                  registrations={registrations}
                  tables={tournamentTables}
                />
              </TabsContent>
            )}
            
            {isTournamentStarted && (
              <TabsContent value="chat">
                <TournamentChat 
                  tournamentId={tournament.id}
                  tournamentName={tournament.name}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        {/* Tournament registration sidebar */}
        <div className="md:w-80 flex-shrink-0">
          <TournamentRegComponent 
            tournament={tournament}
            onRegistrationChange={handleRegistrationChange}
          />

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('tournaments.recentRegistrations')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {registrations.slice(0, 5).map(reg => (
                  <div key={reg.id} className="flex items-center">
                    <div className="h-8 w-8 bg-navy rounded-full flex items-center justify-center mr-2">
                      {reg.player_name?.[0] || '?'}
                    </div>
                    <div>
                      <div className="font-medium">{reg.player_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(reg.registration_time), 'PPpp')}
                      </div>
                    </div>
                  </div>
                ))}
                {registrations.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    {t('tournaments.noRegistrationsYet')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Share Dialog */}
      <ShareTournamentDialog 
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        tournament={tournament}
      />
    </div>
  );
};

export default TournamentDetail;
