
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RefreshCcw, Filter, Plus } from 'lucide-react';
import { 
  TournamentCard,
  TournamentFiltersPanel
} from '@/components/tournaments';
import { useTournaments } from '@/hooks/useTournaments';
import { TournamentFilters, DEFAULT_TOURNAMENT_FILTERS } from '@/types/tournaments';
import { useAuth } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { TournamentCreateDialog } from './TournamentCreateDialog';

export function TournamentLobby() {
  const [filters, setFilters] = useState<TournamentFilters>(DEFAULT_TOURNAMENT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFilters, setOpenFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const { tournaments, loading, refreshTournaments } = useTournaments(filters);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isTablet } = useDeviceInfo();
  const { user } = useAuth();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, searchQuery });
  };
  
  const handleApplyFilters = (newFilters: TournamentFilters) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.searchQuery || '');
    setOpenFilters(false);
  };
  
  const handleTournamentClick = (tournamentId: string) => {
    navigate(`/tournaments/${tournamentId}`);
  };

  // Filter tournaments by status for each tab
  const upcomingTournaments = tournaments.filter(t => 
    ['SCHEDULED', 'REGISTERING'].includes(t.status)
  );
  
  const runningTournaments = tournaments.filter(t => 
    ['RUNNING', 'BREAK', 'FINAL_TABLE'].includes(t.status)
  );
  
  const completedTournaments = tournaments.filter(t => 
    ['COMPLETED'].includes(t.status)
  );
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('tournaments.lobby', 'Tournament Lobby')}</h1>
          <p className="text-muted-foreground mt-1">{t('tournaments.lobbyDescription', 'Join poker tournaments or create your own')}</p>
        </div>
        <div className="flex items-center gap-2 self-end">
          <Button variant="outline" size="sm" onClick={() => refreshTournaments()}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('refresh', 'Refresh')}
          </Button>
          
          {user && (
            <TournamentCreateDialog />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          {isTablet ? (
            <Sheet open={openFilters} onOpenChange={setOpenFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mb-4">
                  <Filter className="h-4 w-4 mr-2" />
                  {t('filters', 'Filters')}
                  {Object.keys(filters).some(key => 
                    JSON.stringify(filters[key as keyof TournamentFilters]) !== 
                    JSON.stringify(DEFAULT_TOURNAMENT_FILTERS[key as keyof TournamentFilters])) && (
                    <Badge className="ml-2 bg-emerald text-black" variant="secondary">
                      {t('active', 'Active')}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <h3 className="text-lg font-medium py-4">{t('filters', 'Filters')}</h3>
                <TournamentFiltersPanel filters={filters} onChange={handleApplyFilters} />
              </SheetContent>
            </Sheet>
          ) : (
            <TournamentFiltersPanel filters={filters} onChange={handleApplyFilters} />
          )}
          
          <form onSubmit={handleSearch} className="mb-6 mt-4">
            <div className="flex gap-2">
              <Input
                placeholder={t('tournaments.searchPlaceholder', 'Search tournaments...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="sm" variant="secondary">
                {t('search', 'Search')}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">
                {t('tournaments.upcoming', 'Upcoming')}
                <Badge className="ml-2" variant="secondary">
                  {upcomingTournaments.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="running">
                {t('tournaments.running', 'Running')}
                <Badge className="ml-2" variant="secondary">
                  {runningTournaments.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                {t('tournaments.completed', 'Completed')}
                <Badge className="ml-2" variant="secondary">
                  {completedTournaments.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="border-none p-0">
              {loading ? (
                <p className="text-center py-12">{t('loading', 'Loading...')}</p>
              ) : upcomingTournaments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingTournaments.map((tournament) => (
                    <TournamentCard 
                      key={tournament.id} 
                      tournament={tournament}
                      onClick={() => handleTournamentClick(tournament.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    {t('tournaments.noUpcoming', 'No upcoming tournaments found')}
                  </p>
                  {user && (
                    <TournamentCreateDialog>
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('tournaments.createNew', 'Create Tournament')}
                      </Button>
                    </TournamentCreateDialog>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="running" className="border-none p-0">
              {loading ? (
                <p className="text-center py-12">{t('loading', 'Loading...')}</p>
              ) : runningTournaments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {runningTournaments.map((tournament) => (
                    <TournamentCard 
                      key={tournament.id} 
                      tournament={tournament}
                      onClick={() => handleTournamentClick(tournament.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    {t('tournaments.noRunning', 'No tournaments currently running')}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="border-none p-0">
              {loading ? (
                <p className="text-center py-12">{t('loading', 'Loading...')}</p>
              ) : completedTournaments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedTournaments.map((tournament) => (
                    <TournamentCard 
                      key={tournament.id} 
                      tournament={tournament}
                      onClick={() => handleTournamentClick(tournament.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    {t('tournaments.noCompleted', 'No completed tournaments found')}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
