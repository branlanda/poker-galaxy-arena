
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTournaments } from '@/hooks/useTournaments';
import { TournamentCard } from '@/components/tournaments/TournamentCard';
import { TournamentFiltersPanel } from '@/components/tournaments/TournamentFiltersPanel';
import { TournamentCreateDialog } from './TournamentCreateDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/stores/auth';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            {t('tournaments.errorLoading')}
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={refreshTournaments}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {t('tournaments.title')}
              </h1>
              <p className="text-gray-400 mt-1">
                {t('tournaments.subtitle')}
              </p>
            </div>
            
            {user && (
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('tournaments.createTournament')}
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t('tournaments.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tournaments Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-navy/70 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('tournaments.noTournaments')}
              </h3>
              <p className="text-gray-400 mb-6">
                {t('tournaments.noTournamentsDescription')}
              </p>
              {user && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('tournaments.createFirstTournament')}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onClick={() => handleTournamentClick(tournament.id)}
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
        onTournamentCreated={handleTournamentCreated}
      />
    </div>
  );
}
