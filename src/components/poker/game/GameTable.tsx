
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
  
  // Responsive seat positions - optimized for different screen sizes
  const seatPositions = [
    { top: '80%', left: '50%', transform: 'translate(-50%, -50%)', mobile: { top: '85%', left: '50%' } },     // Seat 0 - Bottom center
    { top: '68%', left: '12%', transform: 'translate(-50%, -50%)', mobile: { top: '72%', left: '8%' } },      // Seat 1 - Bottom left
    { top: '45%', left: '2%', transform: 'translate(-50%, -50%)', mobile: { top: '50%', left: '1%' } },       // Seat 2 - Middle left
    { top: '22%', left: '12%', transform: 'translate(-50%, -50%)', mobile: { top: '25%', left: '8%' } },      // Seat 3 - Top left
    { top: '8%', left: '32%', transform: 'translate(-50%, -50%)', mobile: { top: '10%', left: '30%' } },      // Seat 4 - Top left-center
    { top: '8%', left: '68%', transform: 'translate(-50%, -50%)', mobile: { top: '10%', left: '70%' } },      // Seat 5 - Top right-center
    { top: '22%', left: '88%', transform: 'translate(-50%, -50%)', mobile: { top: '25%', left: '92%' } },     // Seat 6 - Top right
    { top: '45%', left: '98%', transform: 'translate(-50%, -50%)', mobile: { top: '50%', left: '99%' } },     // Seat 7 - Middle right
    { top: '68%', left: '88%', transform: 'translate(-50%, -50%)', mobile: { top: '72%', left: '92%' } },     // Seat 8 - Bottom right
  ];

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-full border-4 sm:border-6 lg:border-8 border-amber-600/80 shadow-2xl overflow-hidden mx-auto max-w-7xl">
      <TableBackground />
      
      <CenterArea 
        communityCards={game.communityCards || []}
        phase={game.phase as GamePhase}
        pot={game.pot}
      />
      
      {/* Render all seats with responsive positioning */}
      {Array.from({ length: maxSeats }, (_, seatIndex) => {
        const player = occupiedSeats[seatIndex];
        const isCurrentPlayer = player?.playerId === userId;
        const isActive = game.activeSeat === seatIndex;
        const position = seatPositions[seatIndex];
        
        return (
          <div
            key={seatIndex}
            className="absolute transition-all duration-300 ease-in-out"
            style={{
              top: position.top,
              left: position.left,
              transform: position.transform,
              // Apply mobile positioning on smaller screens
              '@media (max-width: 768px)': {
                top: position.mobile.top,
                left: position.mobile.left,
              }
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
      
      {/* Dealer button with responsive positioning */}
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
