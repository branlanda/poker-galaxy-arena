
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameTableManager } from '../game/GameTableManager';
import { OpenTable } from '@/types/tableManager';

interface ActiveTableViewProps {
  activeTableId: string | null;
  openTables: OpenTable[];
}

export const ActiveTableView: React.FC<ActiveTableViewProps> = ({
  activeTableId,
  openTables
}) => {
  const activeTable = openTables.find(table => table.id === activeTableId);

  if (!activeTable) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        <div className="text-center">
          <div className="text-lg mb-2">No hay mesa activa</div>
          <div className="text-sm">Selecciona una mesa para continuar jugando</div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTableId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        <GameTableManager
          tableId={activeTable.id}
          onClose={() => {
            // Handle table close if needed
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};
