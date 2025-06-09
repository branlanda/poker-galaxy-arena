
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, GamePhase } from '@/types/poker';
import { RealPokerCard } from '../cards/RealPokerCard';

interface PremiumCommunityCardsProps {
  cards: Card[];
  phase: GamePhase;
  pot: number;
}

export const PremiumCommunityCards: React.FC<PremiumCommunityCardsProps> = ({
  cards,
  phase,
  pot
}) => {
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
        return 0;
    }
  };

  const visibleCount = getVisibleCardCount();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Premium community cards */}
      <div className="flex justify-center items-center gap-3 mb-6">
        {Array.from({ length: 5 }, (_, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ rotateY: 180, scale: 0.8, y: 50 }}
            animate={{ 
              rotateY: index < visibleCount ? 0 : 180, 
              scale: index < visibleCount ? 1 : 0.8,
              y: index < visibleCount ? 0 : 10
            }}
            transition={{ 
              delay: index * 0.2, 
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
          >
            {index < cards.length && index < visibleCount ? (
              <div className="relative">
                <RealPokerCard 
                  card={cards[index]} 
                  size="lg"
                  faceDown={false}
                  className="shadow-2xl border-2 border-amber-400/30"
                />
                {/* Premium card glow */}
                <div className="absolute inset-0 rounded-lg shadow-[0_0_30px_rgba(245,158,11,0.3)] pointer-events-none"></div>
              </div>
            ) : (
              <div className="w-24 h-32 rounded-lg border-2 border-dashed border-amber-500/40 bg-gradient-to-br from-amber-900/20 to-amber-800/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <div className="text-amber-400/50 text-lg font-bold">?</div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Premium pot display */}
      {pot > 0 && (
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {/* Premium glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/30 via-amber-500/40 to-amber-400/30 rounded-2xl blur-xl"></div>
          
          {/* Premium pot container */}
          <div className="relative bg-gradient-to-br from-slate-900/95 to-black/95 backdrop-blur-xl rounded-2xl border-2 border-amber-500/60 shadow-2xl px-8 py-4">
            <div className="flex items-center gap-4">
              {/* Premium chip stack animation */}
              <div className="relative">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-3 border-amber-300 shadow-lg flex items-center justify-center"
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <div className="w-4 h-4 bg-amber-200 rounded-full"></div>
                </motion.div>
                
                {/* Floating mini chips */}
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full border border-red-300"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border border-blue-300"
                  animate={{ 
                    y: [0, -6, 0],
                    rotate: [0, -180, -360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.7
                  }}
                />
              </div>

              {/* Premium pot text */}
              <div className="text-center">
                <div className="text-amber-300/80 text-sm font-medium tracking-wide uppercase">
                  Bote Total
                </div>
                <motion.div 
                  className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent tracking-wide"
                  animate={{ 
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ${pot.toLocaleString()}
                </motion.div>
              </div>
            </div>

            {/* Premium sparkle effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-amber-400 rounded-full"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${10 + (i % 2) * 80}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
