
import { useState, useRef, useEffect } from 'react';
import { TableFilters, DEFAULT_FILTERS } from '@/types/lobby';
import { useLobbyTables } from '@/hooks/useLobbyTables';
import { LobbyFilters } from '@/components/lobby/LobbyFilters';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { LobbyHeader } from '@/components/lobby/LobbyHeader';
import { TableGroups } from '@/components/lobby/TableGroups';
import { LoadingState } from '@/components/lobby/LoadingState';
import { EmptyState } from '@/components/lobby/EmptyState';
import { InfiniteScrollIndicator } from '@/components/lobby/InfiniteScrollIndicator';
import { useTableGrouping } from '@/hooks/useTableGrouping';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

export default function LobbyPage() {
  const [filters, setFilters] = useState<TableFilters>({
    ...DEFAULT_FILTERS,
    showActive: false,
    sortBy: 'activity'
  });
  
  const { 
    tables, 
    loading, 
    hasMore, 
    loadMore, 
    refreshTables, 
    error 
  } = useLobbyTables(filters);
  
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { newTableIds, groupAndSortTables } = useTableGrouping(tables);
  const { isMobile, deviceType } = useDeviceInfo();
  const { toast } = useToast();
  
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
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerAnimation}
      className={`container mx-auto px-4 py-6 ${isMobile ? 'pb-16' : ''}`}
      drag={isMobile ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        if (Math.abs(info.offset.x) > 100) {
          handleSwipeAction(info.offset.x > 0 ? 'right' : 'left');
        }
      }}
    >
      <Toaster />
      
      <motion.div variants={itemAnimation}>
        <LobbyHeader onRefresh={refreshTables} loading={loading} />
      </motion.div>
      
      <motion.div variants={itemAnimation} className="mt-4">
        <LobbyFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />
      </motion.div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          className="mt-6 space-y-8"
          key={loading && tables.length === 0 ? 'loading' : 'content'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loading && tables.length === 0 ? (
            <LoadingState />
          ) : tables.length > 0 ? (
            <>
              <TableGroups 
                tables={tables}
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
          <div className="bg-navy/80 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg text-sm border border-emerald/20">
            {t('lobby.swipeToNavigate', 'Desliza para navegar')} ↔️
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
