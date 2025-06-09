
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, PlayerStatus } from '@/types/poker';
import { RealPokerCard } from '../cards/RealPokerCard';

interface PlayerCardsProps {
  holeCards?: Card[];
  status: PlayerStatus;
  isCurrentPlayer?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showCards?: boolean;
}

export function PlayerCards({ 
  holeCards, 
  status, 
  isCurrentPlayer = false,
  size = 'sm',
  showCards = false
}: PlayerCardsProps) {
  if (status === 'FOLDED') {
    return null;
  }

  // Determine if cards should be face up
  const shouldShowCards = isCurrentPlayer && showCards && holeCards && holeCards.length === 2;

  return (
    <div className="flex justify-center gap-1 relative" style={{ zIndex: 200 }}>
      <AnimatePresence>
        {shouldShowCards ? (
          // Show real cards for current player when visible
          holeCards.map((card, index) => (
            <motion.div
              key={`${card.code}-${index}`}
              className="relative"
              initial={{ rotateY: 180, x: index === 0 ? -20 : 20, opacity: 0 }}
              animate={{ rotateY: 0, x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
              style={{ zIndex: 200 + index }}
            >
              <RealPokerCard 
                card={card} 
                size={size}
                faceDown={false}
                animate={false}
              />
            </motion.div>
          ))
        ) : (
          // Show card backs for hidden cards
          [0, 1].map(index => (
            <motion.div
              key={`facedown-${index}`}
              className="relative"
              initial={{ rotateY: 180, x: index === 0 ? -20 : 20, opacity: 0 }}
              animate={{ rotateY: 0, x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{ zIndex: 200 + index }}
            >
              <RealPokerCard 
                size={size}
                faceDown={true}
                animate={false}
              />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
