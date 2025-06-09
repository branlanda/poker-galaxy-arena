
import React from 'react';
import { Card } from '@/types/poker';
import { RealPokerCard } from './cards/RealPokerCard';

interface PokerCardProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  faceDown?: boolean;
}

export function PokerCard({ card, size = 'md', faceDown = false }: PokerCardProps) {
  // Map old size system to new size system
  const sizeMap = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const
  };

  return (
    <RealPokerCard
      card={card}
      size={sizeMap[size]}
      faceDown={faceDown}
      animate={true}
    />
  );
}
