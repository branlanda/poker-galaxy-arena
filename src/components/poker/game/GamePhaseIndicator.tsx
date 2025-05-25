
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GamePhase } from '@/types/poker';

interface GamePhaseIndicatorProps {
  phase: GamePhase;
}

export const GamePhaseIndicator: React.FC<GamePhaseIndicatorProps> = ({ phase }) => {
  const getPhaseStyle = (phase: GamePhase) => {
    switch (phase) {
      case 'WAITING': return 'bg-gray-800/60 text-gray-300';
      case 'PREFLOP': return 'bg-blue-900/60 text-blue-300';
      case 'FLOP': return 'bg-green-900/60 text-green-300';
      case 'TURN': return 'bg-amber-900/60 text-amber-300';
      case 'RIVER': return 'bg-purple-900/60 text-purple-300';
      default: return 'bg-red-900/60 text-red-300';
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10">
      <Badge 
        variant="outline" 
        className={`px-3 py-1 font-medium text-sm ${getPhaseStyle(phase)}`}
      >
        {phase}
      </Badge>
    </div>
  );
};
