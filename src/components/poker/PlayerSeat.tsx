
import React from 'react';
import { Card, PlayerState } from '@/types/poker';
import { PokerCard } from './PokerCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Award,
  UserCircle2,
  ShieldAlert,
  Clock
} from 'lucide-react';

interface PlayerSeatProps {
  position: number;
  player?: PlayerState;
  state?: any; // Adding this prop to match what's coming from PokerTable
  isCurrentPlayer: boolean;
  isActive: boolean;
  isDealer?: boolean;
  isSmallBlind?: boolean;
  isBigBlind?: boolean;
  holeCards?: Card[];
  onSitDown: () => void;
  disabled?: boolean;
}

export function PlayerSeat({
  position,
  player,
  state,
  isCurrentPlayer,
  isActive,
  isDealer = false,
  isSmallBlind = false,
  isBigBlind = false,
  holeCards,
  onSitDown,
  disabled = false
}: PlayerSeatProps) {
  // Use state prop if provided (from PokerTable)
  const playerState = state || player;
  
  // Calculate the position on the table
  // This is just one way to position seats in a circle
  const positions = [
    { top: '85%', left: '50%' },      // bottom center (0)
    { top: '75%', left: '20%' },      // bottom left (1)
    { top: '50%', left: '5%' },       // middle left (2)
    { top: '25%', left: '20%' },      // top left (3)
    { top: '15%', left: '50%' },      // top center (4)
    { top: '25%', left: '80%' },      // top right (5)
    { top: '50%', left: '95%' },      // middle right (6)
    { top: '75%', left: '80%' },      // bottom right (7)
    { top: '85%', left: '35%' },      // bottom left-center (8)
  ];
  
  const seatStyle = positions[position % positions.length];
  
  if (!playerState) {
    // Empty seat that can be taken
    return (
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={seatStyle}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={onSitDown}
          disabled={disabled}
          className="h-14 w-14 rounded-full bg-navy/60 hover:bg-navy/80 border border-emerald/30"
        >
          <UserCircle2 className="h-6 w-6" />
        </Button>
      </div>
    );
  }
  
  // Get initials for avatar fallback
  const initials = 'P' + (playerState.playerId?.substring(0, 1) || '?');
  
  // Display occupied seat with player info
  return (
    <div 
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 
        ${isActive ? 'scale-110 transition-transform duration-300' : ''}
      `}
      style={seatStyle}
    >
      <div className={`
        p-3 rounded-lg ${isActive ? 'bg-emerald-600/30 border border-emerald-500/50 animate-pulse shadow-lg' : 'bg-navy/70 border border-emerald/10'}
        ${playerState.status === 'FOLDED' ? 'opacity-50' : ''}
        ${playerState.status === 'ALL_IN' ? 'border-amber-500/70' : ''}
      `}>
        {/* Player indicators */}
        <div className="flex space-x-1 mb-1">
          {isDealer && (
            <Badge className="bg-blue-800 text-xs px-1.5 py-0">D</Badge>
          )}
          {isSmallBlind && (
            <Badge className="bg-amber-800 text-xs px-1.5 py-0">SB</Badge>
          )}
          {isBigBlind && (
            <Badge className="bg-red-800 text-xs px-1.5 py-0">BB</Badge>
          )}
          {playerState.status === 'FOLDED' && (
            <Badge className="bg-gray-700 text-xs px-1.5 py-0">Folded</Badge>
          )}
          {playerState.status === 'ALL_IN' && (
            <Badge className="bg-amber-600 text-xs px-1.5 py-0">All In!</Badge>
          )}
        </div>
        
        {/* Player avatar and info */}
        <div className="flex items-center mb-2">
          <Avatar className={`h-8 w-8 mr-2 ${isCurrentPlayer ? 'ring-2 ring-emerald-500' : ''}`}>
            <AvatarImage src="#" />
            <AvatarFallback className="bg-navy">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium truncate w-20">
              {isCurrentPlayer ? 'You' : playerState.playerName || `Player ${playerState.playerId?.substring(0, 4) || '?'}`}
            </div>
            <div className="flex items-center text-xs text-emerald-300">
              <DollarSign className="h-3 w-3 mr-1" />
              <span>{playerState.stack}</span>
            </div>
          </div>
        </div>
        
        {/* Current bet display */}
        {playerState.currentBet > 0 && (
          <div className="flex items-center justify-center p-1 bg-black/30 rounded text-xs mb-2">
            <span className="font-bold text-emerald-300">{playerState.currentBet}</span>
          </div>
        )}
        
        {/* Player cards */}
        {playerState.status !== 'FOLDED' && (
          <div className="flex justify-center space-x-1">
            {holeCards && holeCards.length === 2 ? (
              <>
                <PokerCard card={holeCards[0]} size="sm" />
                <PokerCard card={holeCards[1]} size="sm" />
              </>
            ) : (
              <>
                <div className="w-8 h-12 bg-gray-800 rounded border border-gray-700"></div>
                <div className="w-8 h-12 bg-gray-800 rounded border border-gray-700"></div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
