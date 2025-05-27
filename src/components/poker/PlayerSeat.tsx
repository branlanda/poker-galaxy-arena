
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, PlayerState } from '@/types/poker';
import { PokerCard } from './PokerCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  UserCircle2,
  Crown,
  Timer,
  Zap
} from 'lucide-react';

interface PlayerSeatProps {
  position: number;
  player?: PlayerState;
  state?: any;
  isCurrentPlayer: boolean;
  isActive: boolean;
  isDealer?: boolean;
  isSmallBlind?: boolean;
  isBigBlind?: boolean;
  holeCards?: Card[];
  onSitDown: () => void;
  disabled?: boolean;
}

export function PlayerSeat({
  position,
  player,
  state,
  isCurrentPlayer,
  isActive,
  isDealer = false,
  isSmallBlind = false,
  isBigBlind = false,
  holeCards,
  onSitDown,
  disabled = false
}: PlayerSeatProps) {
  const playerState = state || player;
  
  // Enhanced position calculation for better circular layout (9 seats)
  const positions = [
    { top: '85%', left: '50%' },      // bottom center (0)
    { top: '75%', left: '15%' },      // bottom left (1)
    { top: '50%', left: '5%' },       // middle left (2)
    { top: '25%', left: '15%' },      // top left (3)
    { top: '15%', left: '35%' },      // top left-center (4)
    { top: '15%', left: '65%' },      // top right-center (5)
    { top: '25%', left: '85%' },      // top right (6)
    { top: '50%', left: '95%' },      // middle right (7)
    { top: '75%', left: '85%' },      // bottom right (8)
  ];
  
  const seatStyle = positions[position % positions.length];
  
  if (!playerState) {
    return (
      <motion.div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={seatStyle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: position * 0.1 }}
      >
        <Button
          variant="outline"
          size="lg"
          onClick={onSitDown}
          disabled={disabled}
          className="h-20 w-20 rounded-full bg-slate-800/80 hover:bg-slate-700/90 border-2 border-emerald/40 hover:border-emerald/60 transition-all duration-300 backdrop-blur-sm shadow-lg"
        >
          <UserCircle2 className="h-10 w-10 text-emerald-400" />
        </Button>
      </motion.div>
    );
  }
  
  const initials = playerState.playerName?.substring(0, 2).toUpperCase() || 'P' + (playerState.playerId?.substring(0, 1) || '?');
  
  return (
    <motion.div 
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${
        isActive ? 'scale-110' : 'scale-100'
      } transition-all duration-500`}
      style={seatStyle}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ 
        opacity: 1, 
        scale: isActive ? 1.15 : 1, 
        y: 0 
      }}
      transition={{ 
        type: "spring", 
        damping: 15, 
        stiffness: 300,
        delay: position * 0.1 
      }}
    >
      <div className={`relative p-4 rounded-2xl backdrop-blur-sm border-2 transition-all duration-500 ${
        isActive 
          ? 'bg-gradient-to-br from-emerald-500/40 to-emerald-600/50 border-emerald-400 shadow-[0_0_40px_0_rgba(16,185,129,0.8)]' 
          : 'bg-gradient-to-br from-slate-800/90 to-slate-900/95 border-slate-600/50 shadow-xl'
      } ${
        playerState.status === 'FOLDED' ? 'opacity-60 grayscale' : ''
      } ${
        playerState.status === 'ALL_IN' ? 'border-amber-500/80 shadow-[0_0_25px_0_rgba(245,158,11,0.6)]' : ''
      }`}>
        
        {/* Active player enhanced glow effect */}
        {isActive && (
          <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl opacity-80 blur-md"
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        <div className="relative">
          {/* Player indicators */}
          <div className="flex flex-wrap gap-1 mb-3 justify-center">
            <AnimatePresence>
              {isDealer && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs px-2 py-1 shadow-lg">
                    <Crown className="w-3 h-3 mr-1" />
                    D
                  </Badge>
                </motion.div>
              )}
              {isSmallBlind && (
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1">
                  SB
                </Badge>
              )}
              {isBigBlind && (
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1">
                  BB
                </Badge>
              )}
              {playerState.status === 'FOLDED' && (
                <Badge className="bg-gray-700 text-gray-300 text-xs px-2 py-1">
                  Folded
                </Badge>
              )}
              {playerState.status === 'ALL_IN' && (
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                >
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1">
                    <Zap className="w-3 h-3 mr-1" />
                    ALL IN!
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Enhanced avatar with status ring */}
          <div className="flex flex-col items-center mb-3">
            <div className="relative">
              <motion.div
                className={`p-1 rounded-full ${
                  isCurrentPlayer 
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                    : 'bg-gradient-to-r from-slate-600 to-slate-700'
                }`}
                animate={isActive ? {
                  background: [
                    'linear-gradient(to right, #10b981, #059669)',
                    'linear-gradient(to right, #34d399, #10b981)',
                    'linear-gradient(to right, #10b981, #059669)'
                  ]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Avatar className="h-14 w-14 border-2 border-white/20">
                  <AvatarImage src="#" />
                  <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white font-bold text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              {/* Online status indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              
              {/* Turn timer */}
              {isActive && (
                <motion.div
                  className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <Timer className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>
            
            {/* Player name and info */}
            <div className="text-center mt-2">
              <div className="text-sm font-bold text-white truncate max-w-24">
                {isCurrentPlayer ? 'You' : playerState.playerName || `Player ${playerState.playerId?.substring(0, 4) || '?'}`}
              </div>
              <motion.div 
                className="flex items-center justify-center text-sm font-bold gap-1 mt-1"
                animate={{
                  color: playerState.stack < 100 ? ['#fbbf24', '#ef4444', '#fbbf24'] : '#fbbf24'
                }}
                transition={{
                  duration: 1,
                  repeat: playerState.stack < 100 ? Infinity : 0
                }}
              >
                <DollarSign className="h-4 w-4" />
                <span>{playerState.stack.toLocaleString()}</span>
              </motion.div>
            </div>
          </div>
          
          {/* Current bet display */}
          <AnimatePresence>
            {playerState.currentBet > 0 && (
              <motion.div 
                className="mb-3"
                initial={{ scale: 0, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: -15 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <div className="flex items-center justify-center p-2 bg-gradient-to-r from-amber-500/90 to-amber-600/90 rounded-lg border border-amber-400/60 shadow-lg">
                  <div className="w-4 h-4 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full mr-2"></div>
                  <span className="font-bold text-white text-sm">
                    ${playerState.currentBet.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Player cards */}
          {playerState.status !== 'FOLDED' && (
            <div className="flex justify-center gap-1">
              <AnimatePresence>
                {holeCards && holeCards.length === 2 ? (
                  holeCards.map((card, index) => (
                    <motion.div
                      key={`${card.code}-${index}`}
                      initial={{ 
                        rotateY: 180, 
                        x: index === 0 ? -25 : 25,
                        opacity: 0 
                      }}
                      animate={{ 
                        rotateY: 0, 
                        x: 0,
                        opacity: 1 
                      }}
                      transition={{ 
                        delay: index * 0.2,
                        duration: 0.6,
                        ease: "easeOut"
                      }}
                    >
                      <PokerCard card={card} size="sm" />
                    </motion.div>
                  ))
                ) : (
                  // Face-down cards
                  [0, 1].map((index) => (
                    <motion.div
                      key={`facedown-${index}`}
                      className="w-9 h-13 bg-gradient-to-br from-blue-800 to-blue-900 rounded border border-blue-700 shadow-md flex items-center justify-center"
                      initial={{ 
                        rotateY: 180,
                        x: index === 0 ? -25 : 25,
                        opacity: 0 
                      }}
                      animate={{ 
                        rotateY: 0,
                        x: 0,
                        opacity: 1 
                      }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.5 
                      }}
                    >
                      <div className="w-5 h-7 bg-blue-600 rounded border border-blue-500 flex items-center justify-center">
                        <div className="text-xs text-blue-200 font-bold">♠</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
