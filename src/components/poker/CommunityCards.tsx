
import React from 'react';
import { Card } from '@/types/lobby';
import { PokerCard } from './PokerCard';

interface CommunityCardsProps {
  cards: Card[];
  phase: 'PREFLOP' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN' | 'WAITING';
}

export const CommunityCards: React.FC<CommunityCardsProps> = ({ cards, phase }) => {
  // No community cards in preflop or waiting
  if (phase === 'PREFLOP' || phase === 'WAITING') {
    return (
      <div className="flex justify-center space-x-2 my-4">
        <div className="w-16 h-22 rounded bg-navy/30 border border-emerald/10"></div>
        <div className="w-16 h-22 rounded bg-navy/30 border border-emerald/10"></div>
        <div className="w-16 h-22 rounded bg-navy/30 border border-emerald/10"></div>
        <div className="w-16 h-22 rounded bg-navy/30 border border-emerald/10"></div>
        <div className="w-16 h-22 rounded bg-navy/30 border border-emerald/10"></div>
      </div>
    );
  }

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

  return (
    <div className="flex justify-center space-x-2 my-4">
      {cards.slice(0, visibleCards).map((card, index) => (
        <PokerCard key={`${card.rank}-${card.suit}-${index}`} card={card} />
      ))}
      
      {/* Placeholder cards for future streets */}
      {Array.from({ length: 5 - visibleCards }).map((_, i) => (
        <div key={`placeholder-${i}`} className="w-16 h-22 rounded bg-navy/30 border border-emerald/10"></div>
      ))}
    </div>
  );
};
