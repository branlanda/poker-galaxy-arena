
import React from 'react';
import { PlayerSeat } from '../PlayerSeat';
import { GameState, PlayerState, GamePhase } from '@/types/poker';
import { TableBackground } from './table/TableBackground';
import { CenterArea } from './table/CenterArea';
import { TableStats } from './table/TableStats';
import { DealerButton } from './table/DealerButton';

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
  
  // Optimized seat positions for perfect circular layout matching the image
  const seatPositions = [
    { top: '85%', left: '50%', transform: 'translate(-50%, -50%)' },     // Seat 0 - Bottom center
    { top: '73%', left: '18%', transform: 'translate(-50%, -50%)' },     // Seat 1 - Bottom left
    { top: '50%', left: '7%', transform: 'translate(-50%, -50%)' },      // Seat 2 - Middle left
    { top: '27%', left: '18%', transform: 'translate(-50%, -50%)' },     // Seat 3 - Top left
    { top: '15%', left: '38%', transform: 'translate(-50%, -50%)' },     // Seat 4 - Top left-center
    { top: '15%', left: '62%', transform: 'translate(-50%, -50%)' },     // Seat 5 - Top right-center
    { top: '27%', left: '82%', transform: 'translate(-50%, -50%)' },     // Seat 6 - Top right
    { top: '50%', left: '93%', transform: 'translate(-50%, -50%)' },     // Seat 7 - Middle right
    { top: '73%', left: '82%', transform: 'translate(-50%, -50%)' },     // Seat 8 - Bottom right
  ];

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-full border-8 border-amber-600/80 shadow-2xl overflow-hidden">
      <TableBackground />
      
      <CenterArea 
        communityCards={game.communityCards || []}
        phase={game.phase as GamePhase}
        pot={game.pot}
      />
      
      {/* Render all seats */}
      {Array.from({ length: maxSeats }, (_, seatIndex) => {
        const player = occupiedSeats[seatIndex];
        const isCurrentPlayer = player?.playerId === userId;
        const isActive = game.activeSeat === seatIndex;
        const position = seatPositions[seatIndex];
        
        return (
          <div
            key={seatIndex}
            className="absolute"
            style={{
              top: position.top,
              left: position.left,
              transform: position.transform
            }}
          >
            <PlayerSeat
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
          </div>
        );
      })}
      
      {/* Dealer button */}
      {game.dealerSeat !== undefined && occupiedSeats[game.dealerSeat] && (
        <DealerButton position={seatPositions[game.dealerSeat]} />
      )}
      
      <TableStats
        players={players}
        maxSeats={maxSeats}
        phase={game.phase as GamePhase}
        activeSeat={game.activeSeat}
      />
    </div>
  );
};
