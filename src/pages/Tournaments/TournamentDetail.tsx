
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTournaments } from '@/hooks/useTournaments';
import { TournamentRegistration } from '@/components/tournaments/TournamentRegistration';
import { TournamentBracket } from '@/components/tournaments/TournamentBracket';
import { TournamentChat } from '@/components/tournaments/TournamentChat';
import { ShareTournamentDialog } from './components/ShareTournamentDialog';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Trophy, 
  DollarSign, 
  Clock,
  Share2,
  MessageSquare,
  BarChart3,
  Settings,
  PlayCircle
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/stores/auth';

export default function TournamentDetail() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const {
    selectedTournament,
    tournamentRegistrations,
    tournamentTables,
    loading,
    fetchTournamentById,
    fetchTournamentRegistrations,
    fetchTournamentTables
  } = useTournaments();

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentById(tournamentId);
      fetchTournamentRegistrations(tournamentId);
      fetchTournamentTables(tournamentId);
    }
  }, [tournamentId, fetchTournamentById, fetchTournamentRegistrations, fetchTournamentTables]);

  const handleBack = () => {
    navigate('/tournaments');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'active':
        return 'bg-emerald/20 text-emerald border-emerald/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculatePrizePool = () => {
    if (!selectedTournament || !tournamentRegistrations) return 0;
    return selectedTournament.buy_in * tournamentRegistrations.length;
  };

  if (loading || !selectedTournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-400">{t('tournaments.loading', 'Loading tournament...')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('tournaments.backToLobby', 'Back to Tournaments')}
        </Button>
        <div className="h-6 w-px bg-gray-600"></div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{selectedTournament.name}</h1>
            <Badge className={getStatusColor(selectedTournament.status)}>
              {selectedTournament.status?.toUpperCase()}
            </Badge>
          </div>
          <p className="text-gray-400">
            {t('tournaments.gameType', 'Game Type')}: {selectedTournament.game_type || 'No-Limit Hold\'em'}
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowShareDialog(true)}>
          <Share2 className="h-4 w-4 mr-2" />
          {t('tournaments.share', 'Share')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tournament Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-navy/50 border-emerald/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-emerald" />
                  <span className="text-sm text-gray-400">{t('tournaments.startTime', 'Start Time')}</span>
                </div>
                <p className="font-semibold text-white">
                  {formatDateTime(selectedTournament.start_time)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-navy/50 border-emerald/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-emerald" />
                  <span className="text-sm text-gray-400">{t('tournaments.players', 'Players')}</span>
                </div>
                <p className="font-semibold text-white">
                  {tournamentRegistrations?.length || 0} / {selectedTournament.max_players}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-navy/50 border-emerald/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-emerald" />
                  <span className="text-sm text-gray-400">{t('tournaments.buyIn', 'Buy-in')}</span>
                </div>
                <p className="font-semibold text-white">${selectedTournament.buy_in}</p>
              </CardContent>
            </Card>

            <Card className="bg-navy/50 border-emerald/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-emerald" />
                  <span className="text-sm text-gray-400">{t('tournaments.prizePool', 'Prize Pool')}</span>
                </div>
                <p className="font-semibold text-white">${calculatePrizePool()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tournament Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-navy/60 border border-emerald/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
                <BarChart3 className="h-4 w-4 mr-2" />
                {t('tournaments.overview', 'Overview')}
              </TabsTrigger>
              <TabsTrigger value="bracket" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
                <Trophy className="h-4 w-4 mr-2" />
                {t('tournaments.bracket', 'Bracket')}
              </TabsTrigger>
              <TabsTrigger value="rules" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
                <Settings className="h-4 w-4 mr-2" />
                {t('tournaments.rules', 'Rules')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                {/* Description */}
                <Card className="bg-navy/50 border-emerald/20">
                  <CardHeader>
                    <CardTitle className="text-white">{t('tournaments.description', 'Description')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      {selectedTournament.description || t('tournaments.defaultDescription', 'Join this exciting tournament and compete for the prize pool!')}
                    </p>
                  </CardContent>
                </Card>

                {/* Registered Players */}
                <Card className="bg-navy/50 border-emerald/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-emerald" />
                      {t('tournaments.registeredPlayers', 'Registered Players')}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {tournamentRegistrations?.length || 0} {t('tournaments.playersRegistered', 'players registered')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tournamentRegistrations && tournamentRegistrations.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {tournamentRegistrations.map((registration) => (
                          <div 
                            key={registration.id}
                            className="p-3 bg-navy/30 rounded-lg border border-emerald/10"
                          >
                            <p className="font-medium text-white">{registration.player_name}</p>
                            <p className="text-sm text-gray-400">
                              {t('tournaments.registered', 'Registered')}: {new Date(registration.registration_time || registration.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-8">
                        {t('tournaments.noPlayersYet', 'No players registered yet. Be the first!')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bracket" className="mt-6">
              <TournamentBracket
                tournamentId={selectedTournament.id}
                registrations={tournamentRegistrations || []}
                tables={tournamentTables || []}
              />
            </TabsContent>

            <TabsContent value="rules" className="mt-6">
              <Card className="bg-navy/50 border-emerald/20">
                <CardHeader>
                  <CardTitle className="text-white">{t('tournaments.tournamentRules', 'Tournament Rules')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="font-semibold text-white mb-2">{t('tournaments.gameFormat', 'Game Format')}</h4>
                    <p>{selectedTournament.game_type || 'No-Limit Hold\'em'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">{t('tournaments.blindStructure', 'Blind Structure')}</h4>
                    <p>{t('tournaments.blindsIncrease', 'Blinds increase every 15 minutes')}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">{t('tournaments.payoutStructure', 'Payout Structure')}</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>1st Place: 50% of prize pool</li>
                      <li>2nd Place: 30% of prize pool</li>
                      <li>3rd Place: 20% of prize pool</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">{t('tournaments.additionalRules', 'Additional Rules')}</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t('tournaments.ruleNoChatAbuse', 'No abusive language in chat')}</li>
                      <li>{t('tournaments.ruleNoSlowPlay', 'No excessive slow play')}</li>
                      <li>{t('tournaments.ruleDecisionFinal', 'Tournament director decisions are final')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration/Action Card */}
          <TournamentRegistration 
            tournament={selectedTournament}
          />

          {/* Tournament Chat */}
          <Card className="bg-navy/50 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-emerald" />
                {t('tournaments.chat', 'Tournament Chat')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TournamentChat 
                tournamentId={selectedTournament.id} 
                tournamentName={selectedTournament.name}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareTournamentDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        tournament={selectedTournament}
      />
    </div>
  );
}
