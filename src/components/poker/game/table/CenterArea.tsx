
import React from 'react';
import { motion } from 'framer-motion';
import { CommunityCards } from '../../CommunityCards';
import { Card, GamePhase } from '@/types/poker';

interface CenterAreaProps {
  communityCards: Card[];
  phase: GamePhase;
  pot: number;
}

export const CenterArea: React.FC<CenterAreaProps> = ({ communityCards, phase, pot }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 lg:w-[450px] h-40 flex flex-col items-center justify-center">
      {/* Community cards */}
      <div className="mb-4">
        <CommunityCards 
          cards={communityCards || []} 
          phase={phase} 
        />
      </div>
      
      {/* Pot display */}
      {pot > 0 && (
        <motion.div
          className="bg-gradient-to-r from-amber-600/90 to-amber-500/90 rounded-lg px-4 py-2 border border-amber-400/60 shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className="text-xs text-amber-100 font-medium">Bote Total</div>
            <div className="text-lg font-bold text-white">
              ${pot.toLocaleString()}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
