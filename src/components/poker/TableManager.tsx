
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Trophy, Gamepad2, Zap, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableTab } from './table-manager/TableTab';
import { ActiveTableView } from './table-manager/ActiveTableView';
import { useTableManager } from '@/hooks/useTableManager';
import { OpenTable } from '@/types/tableManager';

interface TableManagerProps {
  currentTableId?: string;
  onTableChange?: (tableId: string) => void;
  onTableClose?: (tableId: string) => void;
}

export const TableManager: React.FC<TableManagerProps> = ({
  currentTableId,
  onTableChange,
  onTableClose
}) => {
  const {
    openTables,
    activeTableId,
    setActiveTable,
    closeTable,
    getTableNotifications,
    updateTableStatus
  } = useTableManager();

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync with external table ID if provided
  useEffect(() => {
    if (currentTableId && currentTableId !== activeTableId) {
      setActiveTable(currentTableId);
    }
  }, [currentTableId, activeTableId, setActiveTable]);

  const handleTableSelect = (tableId: string) => {
    setActiveTable(tableId);
    onTableChange?.(tableId);
  };

  const handleTableClose = (tableId: string) => {
    closeTable(tableId);
    onTableClose?.(tableId);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= openTables.length) {
          e.preventDefault();
          const table = openTables[num - 1];
          if (table) {
            handleTableSelect(table.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [openTables]);

  if (openTables.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col">
      {/* Table Tabs Bar */}
      <div className="bg-slate-900/90 border-b border-emerald/20 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-emerald-300 hover:text-emerald-100"
            >
              <Users className="w-4 h-4" />
              {openTables.length} Mesa{openTables.length !== 1 ? 's' : ''}
            </Button>
            <Badge variant="outline" className="bg-emerald/20 text-emerald-300">
              Activas
            </Badge>
          </div>
          
          <div className="text-xs text-gray-400 hidden sm:block">
            Ctrl+1-8 para cambiar mesa
          </div>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex overflow-x-auto gap-2 px-4 pb-3 scrollbar-thin scrollbar-thumb-emerald/30">
                {openTables.map((table, index) => (
                  <TableTab
                    key={table.id}
                    table={table}
                    isActive={table.id === activeTableId}
                    notifications={getTableNotifications(table.id)}
                    keyboardShortcut={index + 1}
                    onSelect={() => handleTableSelect(table.id)}
                    onClose={() => handleTableClose(table.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Table Content */}
      <div className="flex-1 relative">
        <ActiveTableView
          activeTableId={activeTableId}
          openTables={openTables}
        />
      </div>
    </div>
  );
};
