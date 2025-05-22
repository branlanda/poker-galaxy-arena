
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
  
  // Get full suit name for accessibility
  const getSuitName = (suit: string) => {
    switch (suit) {
      case 'hearts': return 'Hearts';
      case 'diamonds': return 'Diamonds';
      case 'clubs': return 'Clubs';
      case 'spades': return 'Spades';
      default: return '';
    }
  };
  
  // Get card description for screen readers
  const getCardDescription = (card: Card) => {
    return `${card.rank} of ${getSuitName(card.suit)}`;
  };
  
  if (!card) {
    return null; // Return null if no card provided
  }
  
  return (
    <div 
      className={`
        ${sizeClasses[size]} bg-white rounded-md shadow-md
        overflow-hidden flex items-center justify-center relative
        ${className}
      `}
      role="img"
      aria-label={faceDown ? 'Face down card' : getCardDescription(card)}
      tabIndex={0}
    >
      {faceDown ? (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-600 pattern-grid-lg text-opacity-5"
          aria-hidden="true"
        ></div>
      ) : (
        <>
          <div 
            className={`absolute top-1 left-1 ${getCardColor(card.suit)}`}
            aria-hidden="true"
          >
            <div>{card.rank}</div>
            <div>{getSuitSymbol(card.suit)}</div>
          </div>
          <div 
            className={`text-2xl ${getCardColor(card.suit)}`}
            aria-hidden="true"
          >
            {getSuitSymbol(card.suit)}
          </div>
          <div 
            className={`absolute bottom-1 right-1 rotate-180 ${getCardColor(card.suit)}`}
            aria-hidden="true"
          >
            <div>{card.rank}</div>
            <div>{getSuitSymbol(card.suit)}</div>
          </div>
        </>
      )}
      <span className="sr-only">
        {faceDown ? 'Face down card' : getCardDescription(card)}
      </span>
    </div>
  );
};
