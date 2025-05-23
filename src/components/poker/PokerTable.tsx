
import { useState, useEffect } from 'react';
import { SeatState, GameState } from '@/types/game';
import { PlayerSeat } from './PlayerSeat';
import { CommunityCards } from './CommunityCards';
import { PokerChip } from './PokerChip';
import { BetActions } from './BetActions';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [animatePot, setAnimatePot] = useState(false);
  
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
  
  // Animate pot changes
  useEffect(() => {
    if (gameState && gameState.pot > 0 && gameState.lastAction) {
      setAnimatePot(true);
      const timer = setTimeout(() => setAnimatePot(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState?.pot, gameState?.lastAction]);

  if (!gameState) return null;

  const playerSeat = isPlayerSeated && playerSeatIndex >= 0 ? gameState.seats[playerSeatIndex] as SeatState : null;
  
  // Determine the dealer position marker
  const dealerPosition = gameState.dealer >= 0 && gameState.seats[gameState.dealer] ? 
    seatPositions[gameState.dealer] : { top: '50%', left: '50%' };
  
  return (
    <div className="relative w-full aspect-[16/9] max-w-4xl mx-auto bg-emerald-900 rounded-[50%] border-8 border-brown-800 shadow-2xl overflow-hidden">
      {/* Table pattern overlay */}
      <div className="absolute inset-0 bg-[url('/textures/felt.webp')] bg-repeat opacity-30"></div>
      
      {/* Dealer button */}
      {gameState.dealer >= 0 && gameState.seats[gameState.dealer] && (
        <motion.div 
          className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            top: dealerPosition.top,
            left: dealerPosition.left,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white text-black font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-black">
            D
          </div>
        </motion.div>
      )}
      
      {/* Pot display */}
      <AnimatePresence>
        {gameState.pot > 0 && (
          <motion.div 
            className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: animatePot ? [1, 1.2, 1] : 1, 
              opacity: 1 
            }}
            transition={{ duration: 0.5 }}
          >
            <PokerChip value={gameState.pot} size="lg" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Community cards */}
      <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 w-full max-w-md z-10">
        <CommunityCards cards={gameState.communityCards} phase={gameState.phase} />
      </div>
      
      {/* Player seats */}
      {gameState.seats.map((seat, index) => (
        <motion.div 
          key={index}
          className="absolute"
          style={{
            top: seatPositions[index]?.top,
            left: seatPositions[index]?.left,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <PlayerSeat 
            position={index}
            state={seat}
            isCurrentPlayer={userId && seat?.playerId === userId}
            isActive={gameState.activePlayerId === seat?.playerId}
            onSitDown={!isPlayerSeated ? onSitDown : undefined}
          />
        </motion.div>
      ))}
      
      {/* Table center logo/watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-emerald-800/30 flex items-center justify-center pointer-events-none">
        <span className="text-emerald-200/30 font-bold text-xl">POKER</span>
      </div>
      
      {/* Player actions bar */}
      <AnimatePresence>
        {isPlayerTurn && playerSeat && (
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full z-30 px-4 pb-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BetActions 
              playerId={playerSeat.playerId}
              playerStack={playerSeat.stack}
              currentBet={gameState.currentBet}
              playerBet={playerSeat.bet}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Table status - shows current phase */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
        {gameState.phase}
        {gameState.phase !== 'WAITING' && ` • Pot: $${gameState.pot}`}
      </div>
    </div>
  );
}
