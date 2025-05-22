
import { useState } from 'react';
import { TableFilters, DEFAULT_FILTERS, LobbyTable } from '@/types/lobby';
import { useLobbyTables } from '@/hooks/useLobbyTables';
import { LobbyFilters } from '@/components/lobby/LobbyFilters';
import { TableCard } from '@/components/lobby/TableCard';
import { CreateTableDialog } from '@/components/lobby/CreateTableDialog';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/Button';
import { Loader2, Plus, Search, TableProperties } from 'lucide-react';

export default function LobbyPage() {
  const [filters, setFilters] = useState<TableFilters>(DEFAULT_FILTERS);
  const { tables, loading } = useLobbyTables(filters);
  const { user } = useAuth();

  // Group tables by status
  const activeTables = tables.filter(table => table.status === 'ACTIVE' && (table.active_players || 0) > 0);
  const waitingTables = tables.filter(table => table.status === 'WAITING' || ((table.status === 'ACTIVE' && (table.active_players || 0) === 0)));
  const otherTables = tables.filter(table => table.status !== 'ACTIVE' && table.status !== 'WAITING');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald">Poker Tables Lobby</h1>
          <p className="text-gray-400 mt-1">Join an existing table or create your own</p>
        </div>
        <div className="flex gap-2">
          {user ? (
            <CreateTableDialog />
          ) : (
            <Button onClick={() => window.location.href = '/login'}>
              Log In to Create Tables
            </Button>
          )}
        </div>
      </div>
      
      <LobbyFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />
      
      <div className="mt-6">
        {loading ? (
          <div className="grid place-items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald" />
            <p className="text-gray-400 mt-3">Loading tables...</p>
          </div>
        ) : tables.length > 0 ? (
          <div className="space-y-8">
            {activeTables.length > 0 && (
              <div>
                <h2 className="flex items-center text-xl font-semibold mb-3 text-emerald">
                  <TableProperties className="mr-2 h-5 w-5" /> Active Tables ({activeTables.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {activeTables.map((table: LobbyTable) => (
                    <TableCard key={table.id} table={table} />
                  ))}
                </div>
              </div>
            )}
            
            {waitingTables.length > 0 && (
              <div>
                <h2 className="flex items-center text-xl font-semibold mb-3 text-gray-200">
                  <Search className="mr-2 h-5 w-5" /> Available Tables ({waitingTables.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {waitingTables.map((table: LobbyTable) => (
                    <TableCard key={table.id} table={table} />
                  ))}
                </div>
              </div>
            )}
            
            {otherTables.length > 0 && (
              <div>
                <h2 className="flex items-center text-xl font-semibold mb-3 text-gray-400">
                  Other Tables ({otherTables.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {otherTables.map((table: LobbyTable) => (
                    <TableCard key={table.id} table={table} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-navy/30 border border-emerald/10 rounded-lg py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-emerald/10">
                <TableProperties className="h-10 w-10 text-emerald" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-300">No tables found</h3>
            <p className="text-gray-400 mt-2 max-w-md mx-auto">
              {user ? 
                'No tables match your current filters. Adjust your filters or create a new table to start playing!' : 
                'Log in to create your own table or join an existing one!'}
            </p>
            {user && (
              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Clear Filters
                </Button>
                <CreateTableDialog />
              </div>
            )}
            {!user && (
              <div className="mt-6">
                <Button onClick={() => window.location.href = '/login'}>
                  Log In to Play
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
