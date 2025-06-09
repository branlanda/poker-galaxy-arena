
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerState } from '@/types/poker';
import { RealPokerCard } from '../cards/RealPokerCard';
import { Button } from '@/components/ui/button';
import { Crown, Star, CircleDot, Timer } from 'lucide-react';

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
  if (!player) {
    return (
      <motion.div
        className="relative flex flex-col items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-500/50 bg-gradient-to-br from-amber-900/20 to-amber-800/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-900/40 transition-all duration-300 shadow-lg">
          <Button
            onClick={onSitDown}
            variant="ghost"
            size="sm"
            className="text-amber-400 hover:text-amber-300 text-xs font-semibold"
          >
            Sentarse
          </Button>
        </div>
        <div className="text-xs text-amber-500/70 mt-2 font-medium">Asiento {seatNumber + 1}</div>
      </motion.div>
    );
  }

  const playerName = player.playerName || `Player ${seatNumber + 1}`;
  const initials = playerName.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative flex flex-col items-center">
      {/* Premium player cards */}
      <div className="mb-3 flex justify-center gap-1">
        {player.holeCards && player.holeCards.length === 2 ? (
          player.holeCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ rotateY: 180, x: index === 0 ? -15 : 15 }}
              animate={{ rotateY: 0, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <RealPokerCard 
                card={isCurrentUser ? card : undefined}
                size="md"
                faceDown={!isCurrentUser}
                animate={false}
              />
            </motion.div>
          ))
        ) : (
          [0, 1].map(index => (
            <div key={index} className="w-14 h-20 rounded border border-amber-600/30 bg-amber-900/20 backdrop-blur-sm"></div>
          ))
        )}
      </div>

      {/* Premium player info container */}
      <motion.div
        className={`relative p-4 rounded-xl transition-all duration-300 backdrop-blur-xl ${
          isActive 
            ? 'bg-gradient-to-br from-emerald-900/90 to-emerald-800/90 ring-2 ring-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]' 
            : 'bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-amber-500/20'
        } ${isCurrentUser ? 'ring-2 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : ''}`}
        animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
      >
        {/* Premium avatar */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto shadow-lg ${
          isCurrentUser 
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-400' 
            : 'bg-gradient-to-br from-amber-600 to-amber-700 border-2 border-amber-400'
        }`}>
          {initials}
        </div>

        {/* Player info */}
        <div className="text-center">
          <div className="text-sm font-semibold text-white truncate max-w-24 mb-1">
            {playerName}
          </div>
          <div className="text-lg font-bold text-amber-400">
            ${player.stack.toLocaleString()}
          </div>
        </div>

        {/* Current bet display */}
        {player.currentBet > 0 && (
          <motion.div 
            className="mt-3 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-gradient-to-r from-amber-600/90 to-amber-500/90 rounded-lg px-3 py-2 text-sm font-bold text-white shadow-lg border border-amber-400/50">
              ${player.currentBet.toLocaleString()}
            </div>
          </motion.div>
        )}

        {/* Premium badges */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {player.isDealer && (
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center border-2 border-amber-200 shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Crown className="w-4 h-4 text-amber-900" fill="currentColor" />
            </motion.div>
          )}
          {player.isSmallBlind && (
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold border border-blue-300 shadow-lg">
              SB
            </div>
          )}
          {player.isBigBlind && (
            <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold border border-red-300 shadow-lg">
              BB
            </div>
          )}
        </div>

        {/* Premium active indicator */}
        {isActive && (
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
            animate={{ 
              scale: [1, 1.3, 1],
              boxShadow: [
                '0 0 20px rgba(16,185,129,0.8)',
                '0 0 40px rgba(16,185,129,1)',
                '0 0 20px rgba(16,185,129,0.8)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <CircleDot className="w-3 h-3 text-emerald-900" fill="currentColor" />
          </motion.div>
        )}

        {/* Premium timer indicator */}
        {isActive && (
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            initial={{ width: 0 }}
            animate={{ width: '80%' }}
            transition={{ duration: 30, ease: "linear" }}
          >
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-lg"></div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
