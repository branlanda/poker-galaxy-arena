
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerState, GameState } from '@/types/poker';
import { PremiumPlayerSeat } from './PremiumPlayerSeat';
import { PremiumCommunityCards } from './PremiumCommunityCards';
import { Crown, Star } from 'lucide-react';

interface PremiumPokerTableProps {
  gameState: GameState;
  players: PlayerState[];
  userId?: string;
  onSitDown: (seatNumber: number) => void;
  onAction: (action: string, amount?: number) => void;
}

export const PremiumPokerTable: React.FC<PremiumPokerTableProps> = ({
  gameState,
  players,
  userId,
  onSitDown,
  onAction
}) => {
  // Premium seat positions optimized for 9 players
  const seatPositions = [
    { top: '85%', left: '50%', transform: 'translate(-50%, -50%)' }, // Seat 0 (bottom)
    { top: '72%', left: '15%', transform: 'translate(-50%, -50%)' }, // Seat 1 (bottom left)
    { top: '45%', left: '5%', transform: 'translate(-50%, -50%)' },  // Seat 2 (middle left)
    { top: '18%', left: '15%', transform: 'translate(-50%, -50%)' }, // Seat 3 (top left)
    { top: '8%', left: '35%', transform: 'translate(-50%, -50%)' },  // Seat 4 (top left center)
    { top: '5%', left: '50%', transform: 'translate(-50%, -50%)' },  // Seat 5 (top center) - ADJUSTED
    { top: '8%', left: '65%', transform: 'translate(-50%, -50%)' },  // Seat 6 (top right center) - ADJUSTED
    { top: '18%', left: '85%', transform: 'translate(-50%, -50%)' }, // Seat 7 (top right)
    { top: '45%', left: '95%', transform: 'translate(-50%, -50%)' }, // Seat 8 (middle right)
    { top: '72%', left: '85%', transform: 'translate(-50%, -50%)' }  // Seat 9 (bottom right) - ADJUSTED
  ];

  const getPlayerAtSeat = (seatNumber: number) => {
    return players.find(p => p.seatNumber === seatNumber);
  };

  const isPlayerTurn = (playerId: string) => {
    return gameState.activePlayerId === playerId;
  };

  return (
    <div className="relative w-full h-[700px] max-w-6xl mx-auto">
      {/* Premium poker table */}
      <motion.div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, #0f5132 0%, #198754 15%, #20c997 30%, #0d6efd 45%, #6f42c1 70%, #e83e8c 85%, #fd7e14 100%)',
          filter: 'hue-rotate(120deg) saturate(0.8) brightness(0.4)'
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Premium felt texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 opacity-90"></div>
        <div className="absolute inset-0 bg-opacity-30" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z\"/%3E%3C/g%3E%3C/svg%3E')"
        }}></div>
        
        {/* Premium border with glow */}
        <div className="absolute inset-0 rounded-full border-8 border-amber-600 shadow-2xl" 
             style={{ 
               borderImage: 'linear-gradient(45deg, #d97706, #f59e0b, #fbbf24, #f59e0b, #d97706) 1',
               boxShadow: '0 0 50px rgba(245,158,11,0.5)'
             }}>
        </div>

        {/* Inner glow effect */}
        <div className="absolute inset-8 rounded-full shadow-inner" style={{
          boxShadow: 'inset 0 0 100px rgba(16,185,129,0.3)'
        }}></div>
      </motion.div>

      {/* Premium center area */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-48 z-20">
        <PremiumCommunityCards 
          cards={gameState.communityCards || []}
          phase={gameState.phase}
          pot={gameState.pot}
        />
      </div>

      {/* Premium table logo */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full flex items-center justify-center pointer-events-none z-10"
           style={{
             background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.1) 30%, rgba(16, 185, 129, 0.05) 60%, transparent 80%)'
           }}>
        <motion.div
          className="text-center"
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Crown className="w-8 h-8 text-amber-400/50 mx-auto mb-2" />
          <div className="text-amber-200/40 font-bold text-lg tracking-widest">
            POKER GALAXY
          </div>
          <div className="text-emerald-200/30 text-xs tracking-wider">
            PREMIUM TABLE
          </div>
        </motion.div>
      </div>

      {/* Player seats */}
      {Array.from({ length: 9 }, (_, seatNumber) => {
        const player = getPlayerAtSeat(seatNumber);
        const position = seatPositions[seatNumber];
        const isCurrentUser = player?.playerId === userId;
        const isActive = player && isPlayerTurn(player.playerId);

        return (
          <motion.div
            key={`seat-${seatNumber}`}
            className="absolute z-30"
            style={position}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: seatNumber * 0.1 }}
          >
            <PremiumPlayerSeat
              seatNumber={seatNumber}
              player={player}
              isCurrentUser={isCurrentUser}
              isActive={isActive}
              onSitDown={() => onSitDown(seatNumber)}
            />
          </motion.div>
        );
      })}

      {/* Premium dealer button */}
      {gameState.dealerSeat !== undefined && (
        <motion.div
          className="absolute z-40"
          style={{
            ...seatPositions[gameState.dealerSeat],
            top: `calc(${seatPositions[gameState.dealerSeat].top} - 60px)`
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-4 border-amber-200 shadow-2xl flex items-center justify-center"
               style={{ boxShadow: '0 0 20px rgba(245,158,11,0.8)' }}>
            <Crown className="w-6 h-6 text-amber-900" fill="currentColor" />
          </div>
        </motion.div>
      )}

      {/* Premium ambient particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
          style={{
            left: `${10 + i * 7}%`,
            top: `${15 + (i % 4) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};
