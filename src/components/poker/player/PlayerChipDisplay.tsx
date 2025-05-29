
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign } from 'lucide-react';

interface PlayerChipDisplayProps {
  playerName?: string;
  playerId?: string;
  isCurrentPlayer: boolean;
  stack: number;
  currentBet: number;
}

export function PlayerChipDisplay({ 
  playerName, 
  playerId, 
  isCurrentPlayer, 
  stack, 
  currentBet 
}: PlayerChipDisplayProps) {
  const displayName = isCurrentPlayer ? 'You' : playerName || `Player ${playerId?.substring(0, 4) || '?'}`;
  
  return (
    <>
      {/* Player name and chip count */}
      <div className="text-center mt-2">
        <div className="text-sm font-bold text-white truncate max-w-24">
          {displayName}
        </div>
        {/* Enhanced chip count display */}
        <motion.div 
          className="flex items-center justify-center text-lg font-bold gap-1 mt-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-lg px-2 py-1 border border-amber-400/30"
          animate={{
            color: stack < 100 ? ['#fbbf24', '#ef4444', '#fbbf24'] : '#fbbf24'
          }}
          transition={{ duration: 1, repeat: stack < 100 ? Infinity : 0 }}
        >
          <DollarSign className="h-4 w-4" />
          <span className="text-amber-300 font-extrabold text-base">
            {stack.toLocaleString()}
          </span>
        </motion.div>
      </div>
      
      {/* Current bet display */}
      <AnimatePresence>
        {currentBet > 0 && (
          <motion.div 
            className="mb-3"
            initial={{ scale: 0, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -15 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <div className="flex items-center justify-center p-2 bg-gradient-to-r from-amber-500/90 to-amber-600/90 rounded-lg border border-amber-400/60 shadow-lg">
              <div className="w-4 h-4 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full mr-2"></div>
              <span className="font-bold text-white text-sm">
                ${currentBet.toLocaleString()}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
