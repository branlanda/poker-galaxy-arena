
import React, { useRef } from 'react';
import { SeatState } from '@/types/lobby';
import { PokerCard } from './PokerCard';
import { PokerChip } from './PokerChip';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PlayerSeatProps {
  position: number;
  state: SeatState | null;
  isCurrentPlayer?: boolean;
  isActive?: boolean;
  onSitDown?: (position: number) => void;
}

export const PlayerSeat: React.FC<PlayerSeatProps> = ({
  position,
  state,
  isCurrentPlayer = false,
  isActive = false,
  onSitDown,
}) => {
  const seatRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard navigation for sit down button
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSitDown?.(position);
    }
  };
  
  // Get status classes
  const getStatusClasses = () => {
    if (state?.isActive) return 'ring-2 ring-emerald transition-all duration-200';
    if (state?.isFolded) return 'opacity-50';
    if (state?.isAllIn) return 'ring-2 ring-amber-500';
    if (state?.isWinner) return 'ring-4 ring-yellow-400 animate-pulse';
    return '';
  };
  
  // Get the player's initial for the avatar
  const getPlayerInitial = () => {
    return state?.playerName.charAt(0).toUpperCase() || '';
  };
  
  // Get the seat's aria label
  const getSeatAriaLabel = () => {
    if (!state) return `Empty seat ${position + 1}`;
    
    let status = '';
    if (state.isDealer) status += 'Dealer, ';
    if (state.isSmallBlind) status += 'Small Blind, ';
    if (state.isBigBlind) status += 'Big Blind, ';
    if (state.isFolded) status += 'Folded, ';
    if (state.isAllIn) status += 'All In, ';
    if (state.isWinner) status += 'Winner, ';
    if (state.isActive) status += 'Active, ';
    
    return `Seat ${position + 1}: ${state.playerName}, ${state.stack} chips, ${status}`.replace(/, $/, '');
  };

  // If no player in this seat
  if (!state) {
    return (
      <div 
        ref={seatRef}
        className={`
          w-24 h-24 rounded-full flex items-center justify-center
          ${isCurrentPlayer ? 'bg-emerald/10 border-2 border-emerald/30' : 'bg-navy/20'}
          transition-all duration-200
        `}
        role="region"
        aria-label={`Seat ${position + 1}: Empty`}
        tabIndex={onSitDown ? 0 : -1}
        onKeyDown={onSitDown ? handleKeyDown : undefined}
      >
        {onSitDown && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs focus:ring-2 focus:ring-offset-2 focus:ring-emerald" 
            onClick={() => onSitDown(position)}
          >
            Sit Down
          </Button>
        )}
        {!onSitDown && <span className="text-xs opacity-50">Empty</span>}
      </div>
    );
  }

  return (
    <div 
      ref={seatRef}
      className={`relative ${isCurrentPlayer ? 'z-10' : ''}`}
      role="region"
      aria-label={getSeatAriaLabel()}
      tabIndex={0}
    >
      {/* Player Avatar and Info */}
      <div className={`
        relative flex flex-col items-center
        ${getStatusClasses()}
      `}>
        <Avatar className={`
          w-16 h-16 border-2 
          ${isActive ? 'border-emerald' : 'border-gray-700'}
          ${state.isDealer ? 'ring-2 ring-yellow-400' : ''}
        `}>
          <AvatarFallback className="bg-navy text-emerald font-bold" aria-label={`${state.playerName}'s avatar`}>
            {getPlayerInitial()}
          </AvatarFallback>
        </Avatar>
        
        <div className="mt-1 text-center">
          <p className="text-xs font-medium truncate w-20">{state.playerName}</p>
          <p className="text-xs opacity-70">${state.stack}</p>
        </div>

        {/* Player Tags */}
        <div className="absolute -top-2 left-0 right-0 flex justify-center gap-1">
          {state.isDealer && (
            <span className="bg-yellow-500 text-black text-xs px-1 rounded" aria-label="Dealer">D</span>
          )}
          {state.isSmallBlind && (
            <span className="bg-blue-500 text-white text-xs px-1 rounded" aria-label="Small Blind">SB</span>
          )}
          {state.isBigBlind && (
            <span className="bg-red-500 text-white text-xs px-1 rounded" aria-label="Big Blind">BB</span>
          )}
        </div>
      </div>
      
      {/* Cards */}
      {state.cards && (
        <div 
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex -space-x-4"
          aria-label={`${state.playerName}'s cards`}
        >
          <PokerCard 
            card={state.cards[0]} 
            faceDown={!isCurrentPlayer && !state.isWinner} 
            size="sm" 
            className="transform -rotate-6"
          />
          <PokerCard 
            card={state.cards[1]} 
            faceDown={!isCurrentPlayer && !state.isWinner} 
            size="sm"
            className="transform rotate-6"
          />
        </div>
      )}
      
      {/* Bet */}
      {state.bet > 0 && (
        <div 
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
          aria-label={`${state.playerName}'s bet: ${state.bet} chips`}
        >
          <PokerChip value={state.bet} size="sm" />
        </div>
      )}
      
      {/* Winner Amount */}
      {state.isWinner && state.winAmount && (
        <div 
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold animate-bounce"
          aria-live="assertive"
          aria-label={`${state.playerName} won ${state.winAmount} chips`}
        >
          +{state.winAmount}
        </div>
      )}
      
      {/* Fold indicator */}
      {state.isFolded && (
        <div 
          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"
          aria-label={`${state.playerName} folded`}
        >
          <span className="text-white text-xs font-medium">Folded</span>
        </div>
      )}
    </div>
  );
};
