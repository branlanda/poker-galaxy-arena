
import { useState, useEffect, useRef } from 'react';
import { TableFilters, DEFAULT_FILTERS, LobbyTable } from '@/types/lobby';
import { useLobbyTables } from '@/hooks/useLobbyTables';
import { LobbyFilters } from '@/components/lobby/LobbyFilters';
import { TableCard } from '@/components/lobby/TableCard';
import { CreateTableDialog } from '@/components/lobby/CreateTableDialog';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/Button';
import { Fire, Loader2, Plus, RefreshCcw, Search, TableProperties } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useTranslation } from '@/hooks/useTranslation';

export default function LobbyPage() {
  const [filters, setFilters] = useState<TableFilters>({
    ...DEFAULT_FILTERS,
    showActive: false,
    sortBy: 'activity'
  });
  const { tables, loading, hasMore, loadMore, refreshTables } = useLobbyTables(filters);
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // Track new tables to animate them
  const [newTableIds, setNewTableIds] = useState<Set<string>>(new Set());
  const [lastTableCount, setLastTableCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  
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
  
  // Track new tables for animation
  useEffect(() => {
    if (tables.length > lastTableCount) {
      const currentIds = new Set(tables.map(table => table.id));
      const previousIds = new Set(tables.slice(0, lastTableCount).map(table => table.id));
      const newIds = new Set([...currentIds].filter(id => !previousIds.has(id)));
      setNewTableIds(newIds);
    }
    setLastTableCount(tables.length);
    
    // Clear new table IDs after animation
    const timer = setTimeout(() => {
      setNewTableIds(new Set());
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [tables]);
  
  // Group tables by status and activity
  const groupAndSortTables = (tables: LobbyTable[]) => {
    // Check if hot table (3+ active players or 70%+ capacity)
    const isHot = (table: LobbyTable) => {
      return (table.active_players || 0) >= 3 || 
             (table.current_players > 0 && table.current_players >= table.max_players * 0.7);
    };
    
    const hotTables = tables.filter(isHot);
    const activeTables = tables.filter(table => 
      !isHot(table) && 
      table.status === 'ACTIVE' && 
      (table.active_players || 0) > 0
    );
    
    const waitingTables = tables.filter(table => 
      !isHot(table) && 
      !activeTables.includes(table) && 
      (table.status === 'WAITING' || ((table.status === 'ACTIVE' && (table.active_players || 0) === 0)))
    );
    
    const otherTables = tables.filter(table => 
      !isHot(table) && 
      !activeTables.includes(table) && 
      !waitingTables.includes(table)
    );
    
    return { hotTables, activeTables, waitingTables, otherTables };
  };
  
  const { hotTables, activeTables, waitingTables, otherTables } = groupAndSortTables(tables);
  
  const renderTableSection = (title: string, icon: JSX.Element, tables: LobbyTable[], emptyMessage?: string) => {
    if (tables.length === 0) return null;
    
    return (
      <div>
        <h2 className="flex items-center text-xl font-semibold mb-3 text-emerald">
          {icon} {title} ({tables.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {tables.map((table: LobbyTable) => (
              <TableCard 
                key={table.id} 
                table={table} 
                isNew={newTableIds.has(table.id)} 
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald">{t('pokerTablesLobby', 'Poker Tables Lobby')}</h1>
          <p className="text-gray-400 mt-1">{t('lobbyDescription', 'Join an existing table or create your own')}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshTables}
            disabled={loading}
            className="hidden sm:flex"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('refresh', 'Refresh')}
          </Button>
          
          {user ? (
            <CreateTableDialog />
          ) : (
            <Button onClick={() => window.location.href = '/login'}>
              {t('logInToCreateTables', 'Log In to Create Tables')}
            </Button>
          )}
        </div>
      </div>
      
      <LobbyFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({...DEFAULT_FILTERS, showActive: false, sortBy: 'activity'})}
      />
      
      <div className="mt-6 space-y-8">
        {loading && tables.length === 0 ? (
          <div className="grid place-items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald" />
            <p className="text-gray-400 mt-3">{t('loadingTables', 'Loading tables...')}</p>
          </div>
        ) : tables.length > 0 ? (
          <>
            {renderTableSection(
              t('hotTables', 'Hot Tables'), 
              <Fire className="mr-2 h-5 w-5 text-amber-400" />, 
              hotTables
            )}
            
            {renderTableSection(
              t('activeTables', 'Active Tables'), 
              <TableProperties className="mr-2 h-5 w-5" />, 
              activeTables
            )}
            
            {renderTableSection(
              t('availableTables', 'Available Tables'), 
              <Search className="mr-2 h-5 w-5" />, 
              waitingTables
            )}
            
            {renderTableSection(
              t('otherTables', 'Other Tables'), 
              <TableProperties className="mr-2 h-5 w-5 text-gray-400" />, 
              otherTables
            )}
            
            {/* Infinite scroll loading indicator */}
            {hasMore && (
              <div className="w-full flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-emerald" />
              </div>
            )}
            
            {/* Invisible element for infinite scroll detection */}
            <div ref={bottomRef} className="h-4" />
          </>
        ) : (
          <div className="bg-navy/30 border border-emerald/10 rounded-lg py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-emerald/10">
                <TableProperties className="h-10 w-10 text-emerald" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-300">{t('noTablesFound', 'No tables found')}</h3>
            <p className="text-gray-400 mt-2 max-w-md mx-auto">
              {user ? 
                t('noTablesMatch', 'No tables match your current filters. Adjust your filters or create a new table to start playing!') : 
                t('logInToPlay', 'Log in to create your own table or join an existing one!')}
            </p>
            {user && (
              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={() => setFilters({...DEFAULT_FILTERS, showActive: false, sortBy: 'activity'})}>
                  {t('clearFilters', 'Clear Filters')}
                </Button>
                <CreateTableDialog />
              </div>
            )}
            {!user && (
              <div className="mt-6">
                <Button onClick={() => window.location.href = '/login'}>
                  {t('logInToPlay', 'Log In to Play')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
