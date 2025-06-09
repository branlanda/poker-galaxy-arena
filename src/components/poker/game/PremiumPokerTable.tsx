
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerState, GameState } from '@/types/poker';
import { PremiumPlayerSeat } from './PremiumPlayerSeat';
import { PremiumCommunityCards } from './PremiumCommunityCards';
import { Crown, Star, Timer } from 'lucide-react';

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
  // Optimized seat positions with perfect symmetry and curvature for 9 players
  const seatPositions = [
    { top: '85%', left: '50%', transform: 'translate(-50%, -50%)' }, // Seat 0 (bottom center)
    { top: '78%', left: '22%', transform: 'translate(-50%, -50%)' }, // Seat 1 (bottom left)
    { top: '58%', left: '8%', transform: 'translate(-50%, -50%)' },  // Seat 2 (middle left)
    { top: '32%', left: '15%', transform: 'translate(-50%, -50%)' }, // Seat 3 (top left)
    { top: '12%', left: '32%', transform: 'translate(-50%, -50%)' }, // Seat 4 (top left center)
    { top: '5%', left: '50%', transform: 'translate(-50%, -50%)' },  // Seat 5 (top center) - FIXED
    { top: '12%', left: '68%', transform: 'translate(-50%, -50%)' }, // Seat 6 (top right center) - FIXED
    { top: '32%', left: '85%', transform: 'translate(-50%, -50%)' }, // Seat 7 (top right)
    { top: '58%', left: '92%', transform: 'translate(-50%, -50%)' }, // Seat 8 (middle right)
    { top: '78%', left: '78%', transform: 'translate(-50%, -50%)' }  // Seat 9 (bottom right) - FIXED
  ];

  const getPlayerAtSeat = (seatNumber: number) => {
    return players.find(p => p.seatNumber === seatNumber);
  };

  const isPlayerTurn = (playerId: string) => {
    return gameState.activePlayerId === playerId;
  };

  // Premium player icons variety
  const getPlayerIcon = (seatNumber: number, playerName?: string) => {
    const icons = ['👤', '🎯', '🎪', '🎭', '🎨', '🎲', '🎳', '🎸', '🎺'];
    return icons[seatNumber] || '👤';
  };

  return (
    <div className="relative w-full h-[700px] max-w-7xl mx-auto">
      {/* Premium poker table with enhanced 3D effect */}
      <motion.div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, #0a4d2a 0%, #0f5d34 15%, #15733e 30%, #1a8a48 45%, #20a152 60%, #25b85c 75%, #2fcf66 90%, #3ae670 100%)',
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.5))'
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Premium felt texture with depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/80 to-emerald-900/90 opacity-95"></div>
        <div className="absolute inset-0 bg-opacity-40" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M30 30c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z\"/%3E%3C/g%3E%3C/svg%3E')"
        }}></div>
        
        {/* Premium luminous border with glow animation */}
        <div className="absolute inset-0 rounded-full border-8 shadow-2xl" 
             style={{ 
               borderImage: 'linear-gradient(45deg, #f59e0b, #fbbf24, #fcd34d, #fde047, #facc15, #eab308, #d97706) 1',
               boxShadow: '0 0 60px rgba(245,158,11,0.6), inset 0 0 30px rgba(245,158,11,0.2)'
             }}>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(245,158,11,0.3), transparent, rgba(245,158,11,0.3), transparent)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Enhanced inner glow and depth */}
        <div className="absolute inset-6 rounded-full" style={{
          boxShadow: 'inset 0 0 80px rgba(16,185,129,0.4), inset 0 0 40px rgba(52,211,153,0.3)'
        }}></div>

        {/* Premium table rail with 3D effect */}
        <div className="absolute inset-2 rounded-full border-4 border-amber-700/60" style={{
          boxShadow: 'inset 0 -8px 16px rgba(120,53,15,0.7), inset 0 8px 16px rgba(245,158,11,0.3)'
        }}></div>
      </motion.div>

      {/* Premium center area with community cards */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-52 z-20">
        <PremiumCommunityCards 
          cards={gameState.communityCards || []}
          phase={gameState.phase}
          pot={gameState.pot}
        />
      </div>

      {/* Enhanced table logo with casino branding */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full flex items-center justify-center pointer-events-none z-10"
           style={{
             background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.12) 30%, rgba(16, 185, 129, 0.08) 60%, transparent 80%)'
           }}>
        <motion.div
          className="text-center"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Crown className="w-10 h-10 text-amber-400/40 mx-auto mb-3" />
          <div className="text-amber-200/30 font-bold text-2xl tracking-widest mb-1">
            POKER GALAXY
          </div>
          <div className="text-emerald-200/25 text-sm tracking-wider">
            PREMIUM CASINO
          </div>
          <div className="text-amber-300/20 text-xs mt-1">
            TEXAS HOLD'EM
          </div>
        </motion.div>
      </div>

      {/* Player seats with enhanced positioning */}
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
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: seatNumber * 0.1 }}
          >
            <PremiumPlayerSeat
              seatNumber={seatNumber}
              player={player}
              isCurrentUser={isCurrentUser}
              isActive={isActive}
              onSitDown={() => onSitDown(seatNumber)}
            />
            
            {/* Active player timer indicator */}
            {isActive && (
              <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 30, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Enhanced dealer button with 3D effect */}
      {gameState.dealerSeat !== undefined && gameState.dealerSeat >= 0 && (
        <motion.div
          className="absolute z-40"
          style={{
            ...seatPositions[gameState.dealerSeat],
            top: `calc(${seatPositions[gameState.dealerSeat].top} - 70px)`
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 rounded-full border-4 border-amber-200 shadow-2xl flex items-center justify-center"
                 style={{ 
                   boxShadow: '0 0 25px rgba(245,158,11,0.9), inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -2px 8px rgba(0,0,0,0.3)' 
                 }}>
              <Crown className="w-7 h-7 text-amber-900" fill="currentColor" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </motion.div>
      )}

      {/* Game phase indicator with premium styling */}
      <motion.div 
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gradient-to-r from-slate-900/95 to-black/95 backdrop-blur-xl px-8 py-3 rounded-full border-2 border-amber-500/40 shadow-2xl">
          <div className="flex items-center gap-4">
            <Timer className="w-5 h-5 text-amber-400" />
            <span className="text-amber-300 font-bold text-lg tracking-wide uppercase">
              {gameState.phase}
            </span>
            {gameState.pot > 0 && (
              <>
                <div className="w-px h-6 bg-amber-500/40"></div>
                <span className="text-emerald-400 font-semibold">
                  Bote: ${gameState.pot.toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Premium ambient effects and particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-amber-400/40 rounded-full"
          style={{
            left: `${10 + i * 5.5}%`,
            top: `${15 + (i % 5) * 15}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 4.5 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Floating casino chips animation */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`chip-${i}`}
          className={`absolute w-6 h-6 rounded-full border-2 ${
            i % 3 === 0 ? 'bg-red-600 border-red-400' : 
            i % 3 === 1 ? 'bg-blue-600 border-blue-400' : 
            'bg-emerald-600 border-emerald-400'
          }`}
          style={{
            left: `${20 + i * 12}%`,
            top: `${85 + (i % 2) * 5}%`,
            zIndex: 5
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 360],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Premium table reflection effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/5 pointer-events-none"></div>
    </div>
  );
};
