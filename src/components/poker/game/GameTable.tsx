
import React from 'react';
import { TableLayout } from '../TableLayout';
import { PlayerSeat } from '../PlayerSeat';
import { CommunityCards } from '../CommunityCards';
import { GameState, PlayerState, GamePhase } from '@/types/poker';

interface GameTableProps {
  game: GameState;
  players: PlayerState[];
  userId?: string;
  playerHandVisible: boolean;
  isJoining: boolean;
  onSitDown: (seatNumber: number) => void;
}

export const GameTable: React.FC<GameTableProps> = ({
  game,
  players,
  userId,
  playerHandVisible,
  isJoining,
  onSitDown
}) => {
  // Get seats with players
  const occupiedSeats = players.reduce<Record<number, PlayerState>>((acc, player) => {
    acc[player.seatNumber] = player;
    return acc;
  }, {});
  
  // Determine max number of seats
  const maxSeats = 9;
  
  // Generate array of seat positions (0-indexed)
  const seatPositions = Array.from({ length: maxSeats }, (_, i) => i);

  return (
    <TableLayout pot={game.pot}>
      {/* Render all seats */}
      {seatPositions.map((seatIndex) => {
        const player = occupiedSeats[seatIndex];
        const isCurrentPlayer = player?.playerId === userId;
        const isActive = game.activeSeat === seatIndex;
        
        return (
          <PlayerSeat
            key={seatIndex}
            position={seatIndex}
            player={player}
            isCurrentPlayer={isCurrentPlayer}
            isActive={isActive}
            isDealer={player?.isDealer ?? false}
            isSmallBlind={player?.isSmallBlind ?? false}
            isBigBlind={player?.isBigBlind ?? false}
            holeCards={isCurrentPlayer && playerHandVisible ? player?.holeCards : undefined}
            onSitDown={() => onSitDown(seatIndex)}
            disabled={isJoining || !!player}
          />
        );
      })}
      
      {/* Community cards */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <CommunityCards 
          cards={game.communityCards || []} 
          phase={game.phase as GamePhase} 
        />
      </div>
    </TableLayout>
  );
};
