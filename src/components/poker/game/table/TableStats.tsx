
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
      className="absolute bottom-4 right-4 bg-white rounded-lg p-3 border-2 border-black shadow-lg"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="text-xs text-black space-y-1">
        <div className="text-black font-bold">Jugadores: {players.length}/{maxSeats}</div>
        <div className="text-black">Fase: {phase}</div>
        {activeSeat !== undefined && (
          <div className="text-black">Turno: Asiento {activeSeat + 1}</div>
        )}
      </div>
    </motion.div>
  );
};
