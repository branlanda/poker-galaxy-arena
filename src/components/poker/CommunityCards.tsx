
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, GamePhase } from '@/types/poker';
import { RealPokerCard } from './cards/RealPokerCard';

interface CommunityCardsProps {
  cards: Card[];
  phase: GamePhase;
}

export const CommunityCards: React.FC<CommunityCardsProps> = ({ cards, phase }) => {
  const getVisibleCardCount = () => {
    switch (phase) {
      case 'PREFLOP':
      case 'WAITING':
        return 0;
      case 'FLOP':
        return 3;
      case 'TURN':
        return 4;
      case 'RIVER':
      case 'SHOWDOWN':
        return 5;
      default:
        return cards.length;
    }
  };

  const visibleCardCount = getVisibleCardCount();
  const visibleCards = cards.slice(0, visibleCardCount);

  if (visibleCards.length === 0) {
    return (
      <div className="flex justify-center items-center gap-2 h-24">
        <div className="text-white/60 text-sm font-medium">
          Esperando cartas comunitarias...
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-2 h-24">
      <AnimatePresence>
        {visibleCards.map((card, index) => (
          <motion.div
            key={`${card.code}-${index}`}
            initial={{ 
              rotateY: 180, 
              scale: 0.8, 
              opacity: 0,
              y: -20
            }}
            animate={{ 
              rotateY: 0, 
              scale: 1, 
              opacity: 1,
              y: 0
            }}
            transition={{ 
              delay: index * 0.15, 
              duration: 0.6,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <RealPokerCard 
              card={card} 
              size="lg"
              faceDown={false}
              animate={false}
              className="shadow-2xl border-2 border-white/20"
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Show placeholders for remaining cards */}
      {Array.from({ length: 5 - visibleCards.length }, (_, index) => (
        <motion.div
          key={`placeholder-${index}`}
          className="w-20 h-28 rounded-lg border-2 border-dashed border-white/30 bg-white/5 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: visibleCards.length * 0.15 + index * 0.1 }}
        >
          <div className="text-white/40 text-xs">?</div>
        </motion.div>
      ))}
    </div>
  );
};
