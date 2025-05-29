
import { useState, useRef, useEffect } from 'react';
import { TableFilters, DEFAULT_FILTERS } from '@/types/lobby';
import { useLobbyTables } from '@/hooks/useLobbyTables';
import { useFilteredTables } from '@/hooks/useFilteredTables';
import { LobbyFilters } from '@/components/lobby/LobbyFilters';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { TableGroups } from '@/components/lobby/TableGroups';
import { LoadingState } from '@/components/lobby/LoadingState';
import { EmptyState } from '@/components/lobby/EmptyState';
import { InfiniteScrollIndicator } from '@/components/lobby/InfiniteScrollIndicator';
import { useTableGrouping } from '@/hooks/useTableGrouping';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Trophy, Target, Users } from 'lucide-react';
import { CreateTableDialog } from '@/components/lobby/CreateTableDialog';
import { useAuth } from '@/stores/auth';
import { Link } from 'react-router-dom';

export default function LobbyPage() {
  const [filters, setFilters] = useState<TableFilters>({
    ...DEFAULT_FILTERS,
    showActive: false,
    sortBy: 'activity'
  });
  
  // Handler for partial filter updates
  const handleFilterChange = (partialFilters: Partial<TableFilters>) => {
    setFilters(current => ({ ...current, ...partialFilters }));
  };
  
  const { 
    tables: allTables, 
    loading, 
    hasMore, 
    loadMore, 
    refreshTables, 
    error 
  } = useLobbyTables();
  
  // Aplicar filtros a las mesas
  const filteredTables = useFilteredTables(allTables, filters);
  
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { newTableIds, groupAndSortTables } = useTableGrouping(filteredTables);
  const { isMobile, deviceType } = useDeviceInfo();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Set up intersection observer for infinite scrolling
  const bottomInView = useIntersectionObserver(bottomRef, {
    threshold: 0.5,
    rootMargin: '200px',
  });
  
  // Load more tables when bottom is in view
  useEffect(() => {
    if (bottomInView && hasMore && !loading) {
      loadMore();
    }
  }, [bottomInView, hasMore, loading]);

  // Show toast on error
  useEffect(() => {
    if (error) {
      toast({
        title: t('error'),
        description: error,
        variant: 'destructive',
      });
    }
  }, [error]);

  // Reset handler for filters
  const handleResetFilters = () => {
    setFilters({...DEFAULT_FILTERS, showActive: false, sortBy: 'activity'});
  };

  // Mobile swipe navigation
  const handleSwipeAction = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      // Could navigate to next section
      console.log('Swiped left');
    } else {
      // Could open filters on mobile
      console.log('Swiped right');
    }
  };

  // Animations for page elements
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.1 } }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-white">
      <AppLayout showBreadcrumbs={false}>
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.1 } }
          }}
          className={`space-y-6 ${isMobile ? 'pb-16' : ''}`}
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => {
            if (Math.abs(info.offset.x) > 100) {
              // handleSwipeAction(info.offset.x > 0 ? 'right' : 'left');
            }
          }}
        >
          <Toaster />
          
          {/* Navigation Bar */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="bg-white border-black hover:bg-gray-100">
                  <Link to="/tournaments" className="flex items-center text-black hover:text-black">
                    <Trophy className="h-4 w-4 mr-2 text-black" />
                    {t('tournaments.lobby', 'Tournaments')}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="bg-white border-black hover:bg-gray-100">
                  <Link to="/leaderboards" className="flex items-center text-black hover:text-black">
                    <Users className="h-4 w-4 mr-2 text-black" />
                    {t('leaderboards.title', 'Leaderboards')}
                  </Link>
                </Button>
                {user && (
                  <Button variant="ghost" size="sm" className="bg-white border-black hover:bg-gray-100">
                    <Link to="/achievements" className="flex items-center text-black hover:text-black">
                      <Target className="h-4 w-4 mr-2 text-black" />
                      {t('achievements.title', 'Achievements')}
                    </Link>
                  </Button>
                )}
              </nav>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshTables}
                disabled={loading}
                className="hidden sm:flex bg-white border-black hover:bg-gray-100 text-black"
              >
                <RefreshCcw className={`h-4 w-4 mr-2 text-black ${loading ? 'animate-spin' : ''}`} />
                {t('common.refresh', 'Refresh')}
              </Button>
              
              {user ? (
                <CreateTableDialog />
              ) : (
                <Button onClick={() => window.location.href = '/login'} className="bg-black text-white hover:bg-gray-800">
                  {t('auth.login', 'Log In to Create Tables')}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Page Header */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className="text-center">
            <h1 className="text-3xl font-bold text-black mb-2">
              {t('lobby.title', 'Poker Tables Lobby')}
            </h1>
            <p className="text-black">
              {t('lobby.joinTable', 'Join an existing table or create your own')}
            </p>
          </motion.div>
          
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}>
            <LobbyFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              className="space-y-8"
              key={loading && allTables.length === 0 ? 'loading' : 'content'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {loading && allTables.length === 0 ? (
                <LoadingState />
              ) : filteredTables.length > 0 ? (
                <>
                  <TableGroups 
                    tables={filteredTables}
                    groupAndSortTables={groupAndSortTables}
                    newTableIds={newTableIds}
                  />
                  
                  <InfiniteScrollIndicator 
                    bottomRef={bottomRef}
                    hasMore={hasMore}
                    loading={loading}
                  />
                </>
              ) : (
                <EmptyState onResetFilters={handleResetFilters} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Mobile-specific navigation hint */}
          {isMobile && (
            <motion.div 
              className="fixed bottom-4 left-0 right-0 flex justify-center z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="bg-white border border-black text-black px-4 py-2 rounded-full shadow-lg text-sm">
                {t('lobby.swipeToNavigate')} ↔️
              </div>
            </motion.div>
          )}
        </motion.div>
      </AppLayout>
    </div>
  );
}
