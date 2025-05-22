
import { useState, useEffect } from 'react';
import { SeatState, GameState } from '@/types/game';
import { PlayerSeat } from './PlayerSeat';
import { CommunityCards } from './CommunityCards';
import { PokerChip } from './PokerChip';
import { BetActions } from './BetActions';

interface PokerTableProps {
  gameState: GameState | null;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  playerSeatIndex: number;
  userId: string | undefined;
  onSitDown: (seatNumber: number) => void;
}

export function PokerTable({
  gameState,
  isPlayerSeated,
  isPlayerTurn,
  playerSeatIndex,
  userId,
  onSitDown
}: PokerTableProps) {
  const [seatPositions, setSeatPositions] = useState<{ top: string; left: string }[]>([]);
  
  // Calculate seat positions based on table size and number of seats
  useEffect(() => {
    if (!gameState) return;
    
    const numSeats = gameState.seats.length;
    const positions = [];
    
    // Calculate positions in a circle
    for (let i = 0; i < numSeats; i++) {
      // Angle in radians
      const angle = (i * 2 * Math.PI / numSeats) - Math.PI / 2;
      
      // Position on circle
      const top = 50 + 40 * Math.sin(angle);
      const left = 50 + 42 * Math.cos(angle);
      
      positions.push({
        top: `${top}%`,
        left: `${left}%`
      });
    }
    
    setSeatPositions(positions);
  }, [gameState]);

  if (!gameState) return null;

  const playerSeat = isPlayerSeated && playerSeatIndex >= 0 ? gameState.seats[playerSeatIndex] as SeatState : null;
  
  return (
    <div className="relative w-full aspect-[16/9] max-w-4xl mx-auto bg-emerald-900 rounded-[50%] border-8 border-brown-800 shadow-2xl">
      {/* Dealer button */}
      {gameState.dealer >= 0 && gameState.seats[gameState.dealer] && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white text-black font-bold rounded-full w-8 h-8 flex items-center justify-center">
            D
          </div>
        </div>
      )}
      
      {/* Pot display */}
      {gameState.pot > 0 && (
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <PokerChip value={gameState.pot} size="lg" />
        </div>
      )}
      
      {/* Community cards */}
      <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 w-full max-w-md z-10">
        <CommunityCards cards={gameState.communityCards} phase={gameState.phase} />
      </div>
      
      {/* Player seats */}
      {gameState.seats.map((seat, index) => (
        <div 
          key={index}
          className="absolute"
          style={{
            top: seatPositions[index]?.top,
            left: seatPositions[index]?.left,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <PlayerSeat 
            position={index}
            state={seat}
            isCurrentPlayer={userId && seat?.playerId === userId}
            isActive={gameState.activePlayerId === seat?.playerId}
            onSitDown={!isPlayerSeated ? onSitDown : undefined}
          />
        </div>
      ))}
      
      {/* Player actions bar */}
      {isPlayerTurn && playerSeat && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full z-30">
          <BetActions 
            playerId={playerSeat.playerId}
            playerStack={playerSeat.stack}
            currentBet={gameState.currentBet}
            playerBet={playerSeat.bet}
          />
        </div>
      )}
    </div>
  );
}
