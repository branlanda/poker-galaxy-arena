import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTournaments } from '@/hooks/useTournaments';
import { TournamentRegistration } from '@/components/tournaments/TournamentRegistration';
import { TournamentBracket } from '@/components/tournaments/TournamentBracket';
import { TournamentChat } from '@/components/tournaments/TournamentChat';
import { TournamentInfoHeader } from '@/components/tournaments/TournamentInfoHeader';
import { TournamentPrizeStructure } from '@/components/tournaments/TournamentPrizeStructure';
import { TournamentBlindStructure } from '@/components/tournaments/TournamentBlindStructure';
import { TournamentPlayersTable } from '@/components/tournaments/TournamentPlayersTable';
import { ShareTournamentDialog } from './components/ShareTournamentDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Share2,
  MessageSquare,
  BarChart3,
  Trophy,
  Settings,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/stores/auth';
import { AppLayout } from '@/components/layout/AppLayout';

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

  const handleRefresh = () => {
    if (tournamentId) {
      fetchTournamentById(tournamentId);
      fetchTournamentRegistrations(tournamentId);
      fetchTournamentTables(tournamentId);
    }
  };

  const calculatePrizePool = () => {
    if (!selectedTournament || !tournamentRegistrations) return 0;
    return selectedTournament.buy_in * tournamentRegistrations.length;
  };

  // Default blind structure if none exists
  const defaultBlindStructure = [
    { level: 1, small_blind: 10, big_blind: 20, ante: 0, duration_minutes: 15 },
    { level: 2, small_blind: 15, big_blind: 30, ante: 0, duration_minutes: 15 },
    { level: 3, small_blind: 25, big_blind: 50, ante: 0, duration_minutes: 15 },
    { level: 4, small_blind: 50, big_blind: 100, ante: 0, duration_minutes: 15 },
    { level: 5, small_blind: 75, big_blind: 150, ante: 0, duration_minutes: 15 },
    { level: 6, small_blind: 100, big_blind: 200, ante: 25, duration_minutes: 15 },
    { level: 7, small_blind: 150, big_blind: 300, ante: 25, duration_minutes: 15 },
    { level: 8, small_blind: 200, big_blind: 400, ante: 50, duration_minutes: 15 },
  ];

  // Default payout structure
  const defaultPayoutStructure = [
    { position: 1, percentage: 50 },
    { position: 2, percentage: 30 },
    { position: 3, percentage: 20 },
  ];

  if (loading || !selectedTournament) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <AppLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-400">{t('tournaments.loading', 'Loading tournament...')}</p>
            </div>
          </div>
        </AppLayout>
      </div>
    );
  }

  const blindStructure = selectedTournament.blind_structure || [
    { level: 1, small_blind: 10, big_blind: 20, ante: 0, duration_minutes: 15 },
    { level: 2, small_blind: 15, big_blind: 30, ante: 0, duration_minutes: 15 },
    { level: 3, small_blind: 25, big_blind: 50, ante: 0, duration_minutes: 15 },
    { level: 4, small_blind: 50, big_blind: 100, ante: 0, duration_minutes: 15 },
    { level: 5, small_blind: 75, big_blind: 150, ante: 0, duration_minutes: 15 },
    { level: 6, small_blind: 100, big_blind: 200, ante: 25, duration_minutes: 15 },
    { level: 7, small_blind: 150, big_blind: 300, ante: 25, duration_minutes: 15 },
    { level: 8, small_blind: 200, big_blind: 400, ante: 50, duration_minutes: 15 },
  ];
  const payoutStructure = selectedTournament.payout_structure || [
    { position: 1, percentage: 50 },
    { position: 2, percentage: 30 },
    { position: 3, percentage: 20 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <AppLayout showBreadcrumbs={false}>
        <div className="py-8 space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/tournaments')} className="bg-slate-800/40 border-emerald/20 hover:bg-slate-700/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('tournaments.backToLobby', 'Back to Tournaments')}
            </Button>
            <div className="h-6 w-px bg-gray-600"></div>
            <Button variant="outline" onClick={() => setShowShareDialog(true)} className="bg-slate-800/40 border-emerald/20 hover:bg-slate-700/50">
              <Share2 className="h-4 w-4 mr-2" />
              {t('tournaments.share', 'Share')}
            </Button>
          </div>

          {/* Tournament Header */}
          <TournamentInfoHeader
            tournament={selectedTournament}
            registrationsCount={tournamentRegistrations?.length || 0}
            onRefresh={() => {
              if (tournamentId) {
                fetchTournamentById(tournamentId);
                fetchTournamentRegistrations(tournamentId);
                fetchTournamentTables(tournamentId);
              }
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tournament Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-slate-800/60 border border-emerald/20 w-full">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald flex-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {t('tournaments.overview', 'Overview')}
                  </TabsTrigger>
                  <TabsTrigger value="structure" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald flex-1">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Structure
                  </TabsTrigger>
                  <TabsTrigger value="payouts" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald flex-1">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payouts
                  </TabsTrigger>
                  <TabsTrigger value="players" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald flex-1">
                    <Trophy className="h-4 w-4 mr-2" />
                    Players
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    <TournamentBracket
                      tournamentId={selectedTournament.id}
                      registrations={tournamentRegistrations || []}
                      tables={tournamentTables || []}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="structure" className="mt-6">
                  <TournamentBlindStructure
                    blindStructure={blindStructure}
                    currentLevel={selectedTournament.current_level}
                  />
                </TabsContent>

                <TabsContent value="payouts" className="mt-6">
                  <TournamentPrizeStructure
                    prizePool={calculatePrizePool()}
                    payoutStructure={payoutStructure}
                    playersCount={tournamentRegistrations?.length || 0}
                  />
                </TabsContent>

                <TabsContent value="players" className="mt-6">
                  <TournamentPlayersTable
                    registrations={tournamentRegistrations || []}
                    tournamentStatus={selectedTournament.status}
                    prizePool={calculatePrizePool()}
                    payoutStructure={payoutStructure}
                  />
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
              <div className="bg-slate-800/50 border border-emerald/20 rounded-lg">
                <div className="p-4 border-b border-emerald/20">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald" />
                    {t('tournaments.chat', 'Tournament Chat')}
                  </h3>
                </div>
                <div className="p-0">
                  <TournamentChat 
                    tournamentId={selectedTournament.id} 
                    tournamentName={selectedTournament.name}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Share Dialog */}
          <ShareTournamentDialog
            open={showShareDialog}
            onOpenChange={setShowShareDialog}
            tournament={selectedTournament}
          />
        </div>
      </AppLayout>
    </div>
  );
}
