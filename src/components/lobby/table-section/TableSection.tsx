
import { LobbyTable } from '@/types/lobby';
import { TableCard } from '@/components/lobby/TableCard';
import { AnimatePresence } from 'framer-motion';

interface TableSectionProps {
  title: string;
  icon: JSX.Element;
  tables: LobbyTable[];
  newTableIds: Set<string>;
  className?: string;
}

export function TableSection({ 
  title, 
  icon, 
  tables, 
  newTableIds,
  className = "" 
}: TableSectionProps) {
  if (tables.length === 0) return null;
  
  return (
    <div className={className}>
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
}
