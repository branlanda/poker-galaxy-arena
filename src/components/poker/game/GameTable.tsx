
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
    { 
      top: '80%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      mobileTop: '85%',
      mobileLeft: '50%'
    },
    { 
      top: '68%', 
      left: '12%', 
      transform: 'translate(-50%, -50%)',
      mobileTop: '72%',
      mobileLeft: '8%'
    },
    { 
      top: '45%', 
      left: '2%', 
      transform: 'translate(-50%, -50%)',
      mobileTop: '50%',
      mobileLeft: '1%'
    },
    { 
      top: '22%', 
      left: '12%', 
      transform: 'translate(-50%, -50%)',
      mobileTop: '25%',
      mobileLeft: '8%'
    },
    { 
      top: '8%', 
      left: '32%', 
      transform: 'translate(-50%, -50%)',
      mobileTop: '10%',
      mobileLeft: '30%'
    },
    { 
      top: '8%', 
      left: '68%', 
      transform: 'translate(-50%, -50%)',
      mobileTop: '10%',
      mobileLeft: '70%'
    },
    { 
      top: '22%', 
      left: '88%', 
      transform: 'translate(-50%, -50%)',
      mobileTop: '25%',
      mobileLeft: '92%'
    },
    { 
      top: '45%', 
      left: '98%', 
      transform: 'translate(-50%, -50%)',
      mobileTop: '50%',
      mobileLeft: '99%'
    },
    { 
      top: '68%', 
      left: '88%', 
      transform: 'translate(-50%, -50%)',
      mobileTop: '72%',
      mobileLeft: '92%'
    },
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
            className={`absolute transition-all duration-300 ease-in-out
              ${window.innerWidth <= 768 ? '' : ''}`}
            style={{
              top: window.innerWidth <= 768 ? position.mobileTop : position.top,
              left: window.innerWidth <= 768 ? position.mobileLeft : position.left,
              transform: position.transform,
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
