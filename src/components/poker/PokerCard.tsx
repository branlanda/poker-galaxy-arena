
import React from 'react';
import { Card } from '@/types/lobby';

interface PokerCardProps {
  card?: Card;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PokerCard: React.FC<PokerCardProps> = ({
  card,
  faceDown = false,
  size = 'md',
  className = ''
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-10 h-14',
    md: 'w-16 h-22',
    lg: 'w-20 h-28'
  };

  // Get card color based on suit
  const getCardColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds'
      ? 'text-red-600'
      : 'text-black';
  };
  
  // Get suit symbol
  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };
  
  if (!card) {
    return null; // Return null if no card provided
  }
  
  return (
    <div className={`
      ${sizeClasses[size]} bg-white rounded-md shadow-md
      overflow-hidden flex items-center justify-center relative
      ${className}
    `}>
      {faceDown ? (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-600 pattern-grid-lg text-opacity-5"></div>
      ) : (
        <>
          <div className={`absolute top-1 left-1 ${getCardColor(card.suit)}`}>
            <div>{card.rank}</div>
            <div>{getSuitSymbol(card.suit)}</div>
          </div>
          <div className={`text-2xl ${getCardColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </div>
          <div className={`absolute bottom-1 right-1 rotate-180 ${getCardColor(card.suit)}`}>
            <div>{card.rank}</div>
            <div>{getSuitSymbol(card.suit)}</div>
          </div>
        </>
      )}
    </div>
  );
};
