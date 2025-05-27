
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, GamePhase } from '@/types/poker';
import { PokerCard } from './PokerCard';

interface CommunityCardsProps {
  cards: Card[];
  phase: GamePhase;
}

export const CommunityCards: React.FC<CommunityCardsProps> = ({ cards, phase }) => {
  // Determine how many cards to show based on phase
  const visibleCards = (() => {
    switch (phase) {
      case 'FLOP': return 3;
      case 'TURN': return 4;
      case 'RIVER':
      case 'SHOWDOWN': return 5;
      default: return 0;
    }
  })();

  // Card reveal animations based on phase
  const getCardDelay = (index: number, phase: GamePhase) => {
    if (phase === 'FLOP' && index < 3) return index * 0.2;
    if (phase === 'TURN' && index === 3) return 0;
    if (phase === 'RIVER' && index === 4) return 0;
    return 0;
  };

  return (
    <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 z-15">
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Community cards container with glow effect */}
        <div className="relative p-4 rounded-2xl bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-emerald/20 shadow-[0_8px_32px_0_rgba(6,95,70,0.3)]">
          {/* Phase indicator */}
          {phase !== 'PREFLOP' && phase !== 'WAITING' && (
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide shadow-lg">
                {phase}
              </div>
            </motion.div>
          )}
          
          <div className="flex justify-center gap-3">
            {/* Visible cards */}
            <AnimatePresence>
              {cards.slice(0, visibleCards).map((card, index) => (
                <motion.div
                  key={`community-${card.code}-${index}`}
                  initial={{ 
                    rotateY: 180,
                    y: -50,
                    opacity: 0,
                    scale: 0.8
                  }}
                  animate={{ 
                    rotateY: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1
                  }}
                  transition={{ 
                    delay: getCardDelay(index, phase),
                    duration: 0.8,
                    ease: "easeOut",
                    type: "spring",
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <PokerCard card={card} size="md" />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Placeholder cards for future streets */}
            {Array.from({ length: 5 - visibleCards }).map((_, i) => (
              <motion.div 
                key={`placeholder-${i}`} 
                className="relative w-16 h-24 rounded-lg overflow-hidden"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: phase === 'WAITING' || phase === 'PREFLOP' ? 0.3 : 0.1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Card back design */}
                <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border border-slate-600/50 rounded-lg relative overflow-hidden">
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-emerald-800/20"></div>
                  
                  {/* Center design */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-8 h-8 border-2 border-slate-500/30 rounded-full flex items-center justify-center"
                      animate={{ 
                        rotate: [0, 360],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <div className="w-3 h-3 bg-slate-500/30 rounded-full"></div>
                    </motion.div>
                  </div>
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Cards count indicator */}
          {visibleCards > 0 && (
            <motion.div
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-emerald-300 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {visibleCards} of 5 cards
            </motion.div>
          )}
        </div>
        
        {/* Floating particles around community cards */}
        {visibleCards > 0 && [...Array(4)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
            style={{
              left: `${20 + i * 20}%`,
              top: `${-10 + (i % 2) * 20}%`,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};
