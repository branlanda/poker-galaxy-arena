
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, PlayerStatus } from '@/types/poker';
import { PokerCard } from '../PokerCard';

interface PlayerCardsProps {
  holeCards?: Card[];
  status: PlayerStatus;
}

export function PlayerCards({ holeCards, status }: PlayerCardsProps) {
  if (status === 'FOLDED') {
    return null;
  }

  return (
    <div className="flex justify-center gap-3 relative" style={{ zIndex: 200 }}>
      <AnimatePresence>
        {holeCards && holeCards.length === 2 ? (
          holeCards.map((card, index) => (
            <motion.div
              key={`${card.code}-${index}`}
              className="relative"
              initial={{ rotateY: 180, x: index === 0 ? -30 : 30, opacity: 0 }}
              animate={{ rotateY: 0, x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
              style={{ zIndex: 200 + index }}
            >
              <PokerCard card={card} size="lg" />
            </motion.div>
          ))
        ) : (
          // Face-down cards
          [0, 1].map(index => (
            <motion.div
              key={`facedown-${index}`}
              className="w-16 h-22 bg-gradient-to-br from-blue-800 to-blue-900 rounded border border-blue-700 shadow-md flex items-center justify-center relative"
              initial={{ rotateY: 180, x: index === 0 ? -30 : 30, opacity: 0 }}
              animate={{ rotateY: 0, x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{ zIndex: 200 + index }}
            >
              <div className="w-8 h-10 bg-blue-600 rounded border border-blue-500 flex items-center justify-center">
                <div className="text-lg text-blue-200 font-bold">♠</div>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
