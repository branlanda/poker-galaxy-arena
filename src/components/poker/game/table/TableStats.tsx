
import React from 'react';
import { motion } from 'framer-motion';
import { PlayerState, GamePhase } from '@/types/poker';

interface TableStatsProps {
  players: PlayerState[];
  maxSeats: number;
  phase: GamePhase;
  activeSeat?: number;
}

export const TableStats: React.FC<TableStatsProps> = ({ 
  players, 
  maxSeats, 
  phase, 
  activeSeat 
}) => {
  return (
    <motion.div
      className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-emerald/20"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="text-xs text-emerald-300 space-y-1">
        <div className="text-white">Jugadores: {players.length}/{maxSeats}</div>
        <div className="text-emerald-400">Fase: {phase}</div>
        {activeSeat !== undefined && (
          <div className="text-amber-400">Turno: Asiento {activeSeat + 1}</div>
        )}
      </div>
    </motion.div>
  );
};
