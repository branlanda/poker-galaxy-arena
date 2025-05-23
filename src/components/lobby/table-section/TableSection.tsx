
import { LobbyTable } from '@/types/lobby';
import { TableCard } from '../TableCard';
import { motion, AnimatePresence } from 'framer-motion';

interface TableSectionProps {
  title: string;
  icon: React.ReactNode;
  tables: LobbyTable[];
  newTableIds: Set<string>;
  className?: string;
}

export function TableSection({ title, icon, tables, newTableIds, className = '' }: TableSectionProps) {
  if (tables.length === 0) return null;
  
  return (
    <motion.section 
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center">
        {icon}
        <h2 className="text-lg font-semibold text-emerald">{title}</h2>
        <span className="ml-2 text-sm text-gray-400">({tables.length})</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {tables.map((table) => (
            <motion.div
              key={table.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <TableCard 
                table={table} 
                isNew={newTableIds.has(table.id)} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
