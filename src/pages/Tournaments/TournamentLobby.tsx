
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTournaments } from '@/hooks/useTournaments';
import { TournamentCard } from '@/components/tournaments/TournamentCard';
import { TournamentFiltersPanel } from '@/components/tournaments/TournamentFiltersPanel';
import { TournamentCreateDialog } from './TournamentCreateDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, RefreshCw, Users, Target } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/stores/auth';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';

export default function TournamentLobby() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  const {
    tournaments,
    loading,
    error,
    filters,
    setFilters,
    refreshTournaments
  } = useTournaments();

  useEffect(() => {
    // Update search params when search query changes
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
    
    // Update filters
    setFilters({ searchQuery });
  }, [searchQuery, setSearchParams, setFilters]);

  const handleTournamentCreated = () => {
    setShowCreateDialog(false);
    refreshTournaments();
  };

  const handleTournamentClick = (tournamentId: string) => {
    navigate(`/tournaments/${tournamentId}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <AppLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                {t('tournaments.errorLoading', 'Error loading tournaments')}
              </h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <Button onClick={refreshTournaments} className="bg-emerald hover:bg-emerald/90 text-white">
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('common.refresh', 'Retry')}
              </Button>
            </div>
          </div>
        </AppLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <AppLayout>
        <div className="space-y-6">
          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="bg-slate-800/60 border-emerald/20 hover:bg-slate-700/50 text-white">
              <Link to="/lobby" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {t('lobby.title', 'Lobby')}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="bg-slate-800/60 border-emerald/20 hover:bg-slate-700/50 text-white">
              <Link to="/leaderboards" className="flex items-center">
                <Target className="h-4 w-4 mr-2" />
                {t('leaderboards.title', 'Leaderboards')}
              </Link>
            </Button>
            {user && (
              <Button onClick={() => setShowCreateDialog(true)} className="bg-emerald hover:bg-emerald/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {t('tournaments.createTournament', 'Create Tournament')}
              </Button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="lg:w-80">
              <TournamentFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('tournaments.searchPlaceholder', 'Search tournaments...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/60 border-emerald/20 text-white placeholder-gray-400"
                />
              </div>

              {/* Tournaments Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-64 bg-slate-800/70 rounded-lg animate-pulse border border-emerald/10" />
                  ))}
                </div>
              ) : tournaments.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/70 rounded-lg border border-emerald/20">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t('tournaments.noTournaments', 'No Tournaments Available')}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {t('tournaments.noTournamentsDescription', 'Be the first to create an exciting tournament!')}
                  </p>
                  {user ? (
                    <Button onClick={() => setShowCreateDialog(true)} className="bg-emerald hover:bg-emerald/90 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('tournaments.createFirstTournament', 'Create First Tournament')}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-400">
                        {t('tournaments.loginToCreate', 'Log in to create tournaments')}
                      </p>
                      <Button className="bg-emerald hover:bg-emerald/90 text-white">
                        <Link to="/login">
                          {t('auth.signIn', 'Sign In')}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tournaments.map((tournament) => (
                    <TournamentCard
                      key={tournament.id}
                      tournament={tournament}
                      onClick={() => navigate(`/tournaments/${tournament.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Create Tournament Dialog */}
          <TournamentCreateDialog
            open={showCreateDialog}
            onClose={() => setShowCreateDialog(false)}
            onTournamentCreated={() => {
              setShowCreateDialog(false);
              refreshTournaments();
            }}
          />
        </div>
      </AppLayout>
    </div>
  );
}
