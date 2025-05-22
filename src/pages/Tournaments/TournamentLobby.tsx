
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTournaments } from '@/hooks/useTournaments';
import { Tournament, TournamentFilters, DEFAULT_TOURNAMENT_FILTERS } from '@/types/tournaments';
import { TournamentCard } from '@/components/tournaments/TournamentCard';
import { TournamentFiltersPanel } from '@/components/tournaments/TournamentFiltersPanel';
import { TournamentCreateDialog } from './TournamentCreateDialog';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/Button';

// Import LoadingState or create a simple one if it doesn't exist
const LoadingState = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center p-8">{children}</div>
);

export const TournamentLobby = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [filters, setFilters] = useState<TournamentFilters>(
    location.state?.filters || DEFAULT_TOURNAMENT_FILTERS
  );
  
  const { tournaments, loading, error, refreshTournaments } = useTournaments(filters);
  
  useEffect(() => {
    // Refresh on initial load
    refreshTournaments();
  }, []);

  const handleViewTournament = (tournament: Tournament) => {
    navigate(`/tournaments/${tournament.id}`);
  };

  const handleFilterChange = (newFilters: TournamentFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('tournaments.lobby')}</h1>
          <p className="text-muted-foreground">{t('tournaments.description')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {user && <TournamentCreateDialog />}
          <Button
            variant="outline"
            onClick={refreshTournaments}
          >
            {t('refresh')}
          </Button>
        </div>
      </div>

      <TournamentFiltersPanel 
        filters={filters} 
        onChange={handleFilterChange} 
      />

      {loading ? (
        <LoadingState>{t('loading')}</LoadingState>
      ) : error ? (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-center">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {tournaments.length > 0 ? (
            tournaments.map(tournament => (
              <TournamentCard 
                key={tournament.id} 
                tournament={tournament}
                onClick={handleViewTournament}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              {t('tournaments.noTournaments')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
