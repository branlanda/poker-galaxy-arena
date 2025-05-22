
import { useState } from 'react';
import { TableFilters, DEFAULT_FILTERS, LobbyTable } from '@/types/lobby';
import { useLobbyTables } from '@/hooks/useLobbyTables';
import { LobbyFilters } from '@/components/lobby/LobbyFilters';
import { TableCard } from '@/components/lobby/TableCard';
import { CreateTableDialog } from '@/components/lobby/CreateTableDialog';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export default function LobbyPage() {
  const [filters, setFilters] = useState<TableFilters>(DEFAULT_FILTERS);
  const { tables, loading } = useLobbyTables(filters);
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald">Poker Tables Lobby</h1>
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
            <p className="text-gray-400">Loading tables...</p>
          </div>
        ) : tables.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tables.map((table: LobbyTable) => (
              <TableCard key={table.id} table={table} />
            ))}
          </div>
        ) : (
          <div className="bg-navy/30 border border-emerald/10 rounded-lg py-12 text-center">
            <h3 className="text-xl font-medium text-gray-300">No tables found</h3>
            <p className="text-gray-400 mt-2">
              {user ? 'Be the first to create a table!' : 'Log in to create your own table!'}
            </p>
            {user && (
              <div className="mt-4">
                <CreateTableDialog />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
