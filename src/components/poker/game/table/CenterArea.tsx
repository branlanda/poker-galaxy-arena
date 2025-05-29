
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
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-40 flex flex-col items-center justify-center">
      {/* Community cards */}
      <CommunityCards 
        cards={communityCards || []} 
        phase={phase} 
      />
      
      {/* Pot display */}
      {pot > 0 && (
        <motion.div
          className="mt-4 bg-white rounded-lg px-4 py-2 border-2 border-black shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className="text-xs text-black font-medium">Bote Total</div>
            <div className="text-lg font-bold text-black">
              ${pot.toLocaleString()}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
