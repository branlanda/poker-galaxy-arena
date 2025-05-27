
import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="relative w-full">
      <TableLayout pot={game.pot} phase={game.phase}>
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
        <CommunityCards 
          cards={game.communityCards || []} 
          phase={game.phase as GamePhase} 
        />
        
        {/* Game statistics overlay */}
        <motion.div
          className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-emerald/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-xs text-emerald-300 space-y-1">
            <div>Players: {players.length}/{maxSeats}</div>
            <div>Phase: {game.phase}</div>
            {game.activeSeat !== undefined && (
              <div>Active Seat: {game.activeSeat + 1}</div>
            )}
          </div>
        </motion.div>
      </TableLayout>
    </div>
  );
};
