
import { useState, useRef } from 'react';
import { TableFilters, DEFAULT_FILTERS } from '@/types/lobby';
import { useLobbyTables } from '@/hooks/useLobbyTables';
import { LobbyFilters } from '@/components/lobby/LobbyFilters';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';
import { LobbyHeader } from '@/components/lobby/LobbyHeader';
import { TableGroups } from '@/components/lobby/TableGroups';
import { LoadingState } from '@/components/lobby/LoadingState';
import { EmptyState } from '@/components/lobby/EmptyState';
import { InfiniteScrollIndicator } from '@/components/lobby/InfiniteScrollIndicator';
import { useTableGrouping } from '@/hooks/useTableGrouping';
import { useEffect } from 'react';

export default function LobbyPage() {
  const [filters, setFilters] = useState<TableFilters>({
    ...DEFAULT_FILTERS,
    showActive: false,
    sortBy: 'activity'
  });
  const { tables, loading, hasMore, loadMore, refreshTables } = useLobbyTables(filters);
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { newTableIds, groupAndSortTables } = useTableGrouping(tables);
  
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

  // Reset handler for filters
  const handleResetFilters = () => {
    setFilters({...DEFAULT_FILTERS, showActive: false, sortBy: 'activity'});
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6"
    >
      <LobbyHeader onRefresh={refreshTables} loading={loading} />
      
      <LobbyFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />
      
      <div className="mt-6 space-y-8">
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
            />
          </>
        ) : (
          <EmptyState onResetFilters={handleResetFilters} />
        )}
      </div>
    </motion.div>
  );
}
