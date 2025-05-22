
import { LobbyTable } from '@/types/lobby';
import { TableCard } from '@/components/lobby/TableCard';
import { Flame, TableProperties, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface TableGroupsProps {
  tables: LobbyTable[];
  groupAndSortTables: (tables: LobbyTable[]) => {
    hotTables: LobbyTable[];
    activeTables: LobbyTable[];
    waitingTables: LobbyTable[];
    otherTables: LobbyTable[];
  };
  newTableIds: Set<string>;
}

export function TableGroups({ tables, groupAndSortTables, newTableIds }: TableGroupsProps) {
  const { t } = useTranslation();
  
  const { hotTables, activeTables, waitingTables, otherTables } = groupAndSortTables(tables);
  
  const renderTableSection = (title: string, icon: JSX.Element, tables: LobbyTable[]) => {
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
    <div className="mt-6 space-y-8">
      {renderTableSection(
        t('hotTables', 'Hot Tables'), 
        <Flame className="mr-2 h-5 w-5 text-amber-400" />, 
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
    </div>
  );
}
