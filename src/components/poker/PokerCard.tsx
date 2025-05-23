
import React from 'react';
import { Card } from '@/types/poker';

interface PokerCardProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  faceDown?: boolean;
}

export function PokerCard({ card, size = 'md', faceDown = false }: PokerCardProps) {
  const { suit, value, code } = card;
  
  const sizeClasses = {
    sm: 'w-8 h-12',
    md: 'w-16 h-24',
    lg: 'w-20 h-30'
  };
  
  const textSize = {
    sm: 'text-xs',
    md: 'text-lg',
    lg: 'text-xl'
  };
  
  // If card is face down, show back design
  if (faceDown) {
    return (
      <div className={`${sizeClasses[size]} bg-blue-800 rounded shadow-md flex items-center justify-center`}>
        <div className="w-3/4 h-3/4 bg-blue-600 rounded border-2 border-white/20 flex items-center justify-center">
          <div className="text-white font-bold">PG</div>
        </div>
      </div>
    );
  }
  
  const suitColor = suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black';
  
  const suitSymbol = {
    spades: '♠',
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣'
  }[suit];
  
  return (
    <div className={`${sizeClasses[size]} bg-white rounded shadow-md flex flex-col items-center justify-between p-1`}>
      <div className={`${textSize[size]} ${suitColor} font-bold self-start`}>
        {value}
      </div>
      
      <div className={`${suitColor} ${size === 'sm' ? 'text-xl' : 'text-3xl'}`}>
        {suitSymbol}
      </div>
      
      <div className={`${textSize[size]} ${suitColor} font-bold self-end transform rotate-180`}>
        {value}
      </div>
    </div>
  );
}
