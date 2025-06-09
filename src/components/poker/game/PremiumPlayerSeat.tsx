
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerState } from '@/types/poker';
import { RealPokerCard } from '../cards/RealPokerCard';
import { Button } from '@/components/ui/button';
import { Crown, Star, CircleDot, Timer, User, Shield, Target, Gamepad2 } from 'lucide-react';

interface PremiumPlayerSeatProps {
  seatNumber: number;
  player?: PlayerState;
  isCurrentUser?: boolean;
  isActive?: boolean;
  onSitDown: () => void;
}

export const PremiumPlayerSeat: React.FC<PremiumPlayerSeatProps> = ({
  seatNumber,
  player,
  isCurrentUser = false,
  isActive = false,
  onSitDown
}) => {
  // Variety of player icons instead of just "P"
  const getPlayerIcon = (seatNumber: number, playerName?: string) => {
    const icons = [User, Shield, Target, Gamepad2, Star, Crown, CircleDot, Timer];
    const IconComponent = icons[seatNumber % icons.length] || User;
    return IconComponent;
  };

  const getPlayerColor = (seatNumber: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'from-blue-600 to-blue-700 border-blue-400';
    
    const colors = [
      'from-purple-600 to-purple-700 border-purple-400',
      'from-green-600 to-green-700 border-green-400',
      'from-red-600 to-red-700 border-red-400',
      'from-yellow-600 to-yellow-700 border-yellow-400',
      'from-pink-600 to-pink-700 border-pink-400',
      'from-indigo-600 to-indigo-700 border-indigo-400',
      'from-teal-600 to-teal-700 border-teal-400',
      'from-orange-600 to-orange-700 border-orange-400',
      'from-cyan-600 to-cyan-700 border-cyan-400',
    ];
    
    return colors[seatNumber % colors.length];
  };

  if (!player) {
    return (
      <motion.div
        className="relative flex flex-col items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-28 h-28 rounded-full border-3 border-dashed border-amber-500/60 bg-gradient-to-br from-amber-900/30 to-amber-800/30 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-900/50 transition-all duration-300 shadow-xl"
             style={{
               boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 20px rgba(245,158,11,0.1)'
             }}>
          <Button
            onClick={onSitDown}
            variant="ghost"
            size="sm"
            className="text-amber-400 hover:text-amber-300 text-sm font-bold"
          >
            Sentarse
          </Button>
        </div>
        <div className="text-sm text-amber-500/80 mt-3 font-semibold bg-black/30 px-3 py-1 rounded-full">
          Asiento {seatNumber + 1}
        </div>
      </motion.div>
    );
  }

  const playerName = player.playerName || `Player ${seatNumber + 1}`;
  const PlayerIcon = getPlayerIcon(seatNumber, playerName);
  const colorClass = getPlayerColor(seatNumber, isCurrentUser);

  return (
    <div className="relative flex flex-col items-center">
      {/* Enhanced player cards with 3D effect */}
      <div className="mb-4 flex justify-center gap-1">
        {player.holeCards && player.holeCards.length === 2 ? (
          player.holeCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ rotateY: 180, x: index === 0 ? -20 : 20, y: -10 }}
              animate={{ rotateY: 0, x: 0, y: 0 }}
              transition={{ delay: index * 0.3, duration: 0.8 }}
              style={{
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }}
            >
              <RealPokerCard 
                card={isCurrentUser ? card : undefined}
                size="md"
                faceDown={!isCurrentUser}
                animate={false}
                className="border-2 border-white/20"
              />
            </motion.div>
          ))
        ) : (
          [0, 1].map(index => (
            <div key={index} className="w-16 h-22 rounded-lg border-2 border-amber-600/40 bg-gradient-to-br from-amber-900/30 to-amber-800/30 backdrop-blur-sm shadow-lg"></div>
          ))
        )}
      </div>

      {/* Premium player info container with 3D depth */}
      <motion.div
        className={`relative p-5 rounded-2xl transition-all duration-300 backdrop-blur-xl shadow-2xl ${
          isActive 
            ? 'bg-gradient-to-br from-emerald-900/95 to-emerald-800/95 ring-3 ring-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.6)]' 
            : 'bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-amber-500/30'
        } ${isCurrentUser ? 'ring-3 ring-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)]' : ''}`}
        animate={isActive ? { 
          scale: [1, 1.08, 1],
          boxShadow: [
            '0 0 40px rgba(16,185,129,0.6)',
            '0 0 60px rgba(16,185,129,0.8)',
            '0 0 40px rgba(16,185,129,0.6)'
          ]
        } : { scale: 1 }}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
        style={{
          transform: 'perspective(1000px) rotateX(5deg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Premium avatar with varied icons */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto shadow-xl bg-gradient-to-br ${colorClass}`}
             style={{
               boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)'
             }}>
          <PlayerIcon className="w-10 h-10" />
        </div>

        {/* Enhanced player info */}
        <div className="text-center">
          <div className="text-sm font-bold text-white truncate max-w-28 mb-2 bg-black/20 px-3 py-1 rounded-full">
            {playerName}
          </div>
          <div className="text-xl font-bold text-amber-400 drop-shadow-lg">
            ${player.stack.toLocaleString()}
          </div>
        </div>

        {/* Enhanced current bet display */}
        {player.currentBet > 0 && (
          <motion.div 
            className="mt-4 text-center"
            initial={{ scale: 0, rotateY: 90 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-gradient-to-r from-amber-600/95 to-amber-500/95 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-xl border-2 border-amber-400/60"
                 style={{
                   boxShadow: '0 8px 20px rgba(245,158,11,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                 }}>
              ${player.currentBet.toLocaleString()}
            </div>
          </motion.div>
        )}

        {/* Premium badges with enhanced styling */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {player.isDealer && (
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 rounded-full flex items-center justify-center border-3 border-amber-200 shadow-xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                boxShadow: '0 6px 20px rgba(245,158,11,0.6), inset 0 2px 4px rgba(255,255,255,0.3)'
              }}
            >
              <Crown className="w-5 h-5 text-amber-900" fill="currentColor" />
            </motion.div>
          )}
          {player.isSmallBlind && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-blue-300 shadow-lg">
              SB
            </div>
          )}
          {player.isBigBlind && (
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-red-300 shadow-lg">
              BB
            </div>
          )}
        </div>

        {/* Enhanced active indicator with pulsing effect */}
        {isActive && (
          <motion.div
            className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl border-2 border-emerald-200"
            animate={{ 
              scale: [1, 1.4, 1],
              boxShadow: [
                '0 0 20px rgba(16,185,129,0.8)',
                '0 0 50px rgba(16,185,129,1)',
                '0 0 20px rgba(16,185,129,0.8)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <CircleDot className="w-4 h-4 text-emerald-900" fill="currentColor" />
          </motion.div>
        )}

        {/* Player status indicator */}
        {player.status === 'FOLDED' && (
          <div className="absolute inset-0 bg-red-900/80 rounded-2xl flex items-center justify-center">
            <span className="text-red-200 font-bold text-lg">FOLD</span>
          </div>
        )}
        
        {player.status === 'ALL_IN' && (
          <div className="absolute inset-0 bg-purple-900/80 rounded-2xl flex items-center justify-center">
            <span className="text-purple-200 font-bold text-lg">ALL IN</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
