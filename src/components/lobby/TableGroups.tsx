
import { LobbyTable } from '@/types/lobby';
import { Flame, TableProperties, Search } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { TableSection } from './table-section/TableSection';

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
  
  return (
    <div className="mt-6 space-y-8">
      <TableSection
        title={t('hotTables', 'Hot Tables')}
        icon={<Flame className="mr-2 h-5 w-5 text-amber-400" />}
        tables={hotTables}
        newTableIds={newTableIds}
      />
      
      <TableSection
        title={t('activeTables', 'Active Tables')}
        icon={<TableProperties className="mr-2 h-5 w-5" />}
        tables={activeTables}
        newTableIds={newTableIds}
      />
      
      <TableSection
        title={t('availableTables', 'Available Tables')}
        icon={<Search className="mr-2 h-5 w-5" />}
        tables={waitingTables}
        newTableIds={newTableIds}
      />
      
      <TableSection
        title={t('otherTables', 'Other Tables')}
        icon={<TableProperties className="mr-2 h-5 w-5 text-gray-400" />}
        tables={otherTables}
        newTableIds={newTableIds}
      />
    </div>
  );
}
