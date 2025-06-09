
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/types/poker';
import { getCardImageUrl, hasCardImage, CARD_BACK_IMAGE } from './CardImageMapper';

interface RealPokerCardProps {
  card?: Card;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  faceDown?: boolean;
  className?: string;
  animate?: boolean;
}

const sizeClasses = {
  xs: 'w-8 h-12',      // Very small - for compact areas
  sm: 'w-12 h-16',     // Small - for other players' cards
  md: 'w-16 h-24',     // Medium - for community cards
  lg: 'w-20 h-28',     // Large - for player's hand
  xl: 'w-24 h-36'      // Extra large - for focused view
};

export const RealPokerCard: React.FC<RealPokerCardProps> = ({ 
  card, 
  size = 'md', 
  faceDown = false,
  className = '',
  animate = true
}) => {
  const cardElement = (
    <div 
      className={`${sizeClasses[size]} relative rounded-lg overflow-hidden shadow-lg ${className}`}
      style={{ aspectRatio: '2.5/3.5' }}
    >
      {faceDown || !card ? (
        <img
          src={CARD_BACK_IMAGE}
          alt="Card back"
          className="w-full h-full object-cover rounded-lg"
          draggable={false}
        />
      ) : hasCardImage(card.suit, card.value) ? (
        <img
          src={getCardImageUrl(card.suit, card.value)}
          alt={`${card.value} of ${card.suit}`}
          className="w-full h-full object-cover rounded-lg"
          draggable={false}
        />
      ) : (
        // Fallback to original design if image not found
        <div className="w-full h-full bg-white border-2 border-gray-400 rounded-lg relative shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-50/30"></div>
          
          {/* Top-left corner */}
          <div className={`absolute top-1 left-1 text-xs font-bold leading-none z-10 ${
            card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-black'
          }`}>
            <div className="font-extrabold">{card.value}</div>
            <div className="text-xs leading-none">
              {card.suit === 'hearts' ? '♥' : 
               card.suit === 'diamonds' ? '♦' : 
               card.suit === 'spades' ? '♠' : '♣'}
            </div>
          </div>
          
          {/* Center suit symbol */}
          <div className={`absolute inset-0 flex items-center justify-center z-10 ${
            card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-black'
          }`}>
            <div className={size === 'xs' ? 'text-lg' : size === 'sm' ? 'text-xl' : 'text-2xl'}>
              {card.suit === 'hearts' ? '♥' : 
               card.suit === 'diamonds' ? '♦' : 
               card.suit === 'spades' ? '♠' : '♣'}
            </div>
          </div>
          
          {/* Bottom-right corner (rotated) */}
          <div className={`absolute bottom-1 right-1 text-xs font-bold leading-none transform rotate-180 z-10 ${
            card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-black'
          }`}>
            <div className="font-extrabold">{card.value}</div>
            <div className="text-xs leading-none">
              {card.suit === 'hearts' ? '♥' : 
               card.suit === 'diamonds' ? '♦' : 
               card.suit === 'spades' ? '♠' : '♣'}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!animate) {
    return cardElement;
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.2 }
      }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer"
    >
      {cardElement}
    </motion.div>
  );
};
