
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/types/poker';

interface PokerCardProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  faceDown?: boolean;
}

export function PokerCard({ card, size = 'md', faceDown = false }: PokerCardProps) {
  const { suit, value } = card;
  
  const sizeClasses = {
    sm: 'w-9 h-13',
    md: 'w-12 h-16',
    lg: 'w-16 h-24'
  };
  
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };
  
  // Enhanced face-down card design
  if (faceDown) {
    return (
      <motion.div 
        className={`${sizeClasses[size]} relative rounded-lg overflow-hidden shadow-lg z-50`}
        whileHover={{ scale: 1.05, rotateY: 5 }}
        transition={{ duration: 0.2 }}
        style={{ zIndex: 100 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 border border-blue-700">
          {/* Card back pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          
          {/* Center design */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-2 border-blue-400/30 rounded-lg flex items-center justify-center">
              <motion.div
                className="text-blue-300 font-bold text-xs"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ♠♥♦♣
              </motion.div>
            </div>
          </div>
          
          {/* Corner patterns */}
          <div className="absolute top-1 left-1 w-2 h-2 border border-blue-400/20 rounded-full"></div>
          <div className="absolute top-1 right-1 w-2 h-2 border border-blue-400/20 rounded-full"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 border border-blue-400/20 rounded-full"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 border border-blue-400/20 rounded-full"></div>
        </div>
      </motion.div>
    );
  }
  
  const suitColor = suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black';
  
  const suitSymbol = {
    spades: '♠',
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣'
  }[suit];
  
  // Enhanced face-up card design with better contrast
  return (
    <motion.div 
      className={`${sizeClasses[size]} relative rounded-lg overflow-hidden shadow-xl cursor-pointer z-50`}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
      }}
      transition={{ duration: 0.2 }}
      style={{ zIndex: 100 }}
    >
      {/* Card background with strong white background */}
      <div className="w-full h-full bg-white border-2 border-gray-400 rounded-lg relative shadow-lg">
        {/* Card shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-50/30"></div>
        
        {/* Top-left corner */}
        <div className={`absolute top-1 left-1 ${textSize[size]} ${suitColor} font-bold leading-none z-10`}>
          <div className="font-extrabold">{value}</div>
          <div className={`${size === 'sm' ? 'text-xs' : 'text-sm'} leading-none`}>{suitSymbol}</div>
        </div>
        
        {/* Center suit symbol */}
        <div className={`absolute inset-0 flex items-center justify-center ${suitColor} z-10`}>
          <motion.div
            className={size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-4xl'}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {suitSymbol}
          </motion.div>
        </div>
        
        {/* Bottom-right corner (rotated) */}
        <div className={`absolute bottom-1 right-1 ${textSize[size]} ${suitColor} font-bold leading-none transform rotate-180 z-10`}>
          <div className="font-extrabold">{value}</div>
          <div className={`${size === 'sm' ? 'text-xs' : 'text-sm'} leading-none`}>{suitSymbol}</div>
        </div>
        
        {/* Card shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Premium card border highlight */}
        <div className="absolute inset-0 rounded-lg border border-white/40 pointer-events-none"></div>
      </div>
    </motion.div>
  );
}
