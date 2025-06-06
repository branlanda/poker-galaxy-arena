
import React from 'react';
import { motion } from 'framer-motion';
import { Card, PlayerState } from '@/types/poker';
import { Button } from '@/components/ui/button';
import { UserCircle2 } from 'lucide-react';
import { PlayerAvatar } from './player/PlayerAvatar';
import { PlayerBadges } from './player/PlayerBadges';
import { PlayerChipDisplay } from './player/PlayerChipDisplay';
import { PlayerCards } from './player/PlayerCards';

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

  if (!playerState) {
    return (
      <motion.div 
        className="transform -translate-x-1/2 -translate-y-1/2 z-10" 
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
          className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full bg-slate-800/80 hover:bg-slate-700/90 border-2 border-emerald/40 hover:border-emerald/60 transition-all duration-300 backdrop-blur-sm shadow-lg text-sm sm:text-lg font-extralight text-gray-200 p-0"
        >
          <UserCircle2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-emerald-400" />
        </Button>
      </motion.div>
    );
  }

  const initials = playerState.playerName?.substring(0, 2).toUpperCase() || 
    'P' + (playerState.playerId?.substring(0, 1) || '?');

  return (
    <motion.div 
      className={`transform -translate-x-1/2 -translate-y-1/2 z-10 ${isActive ? 'scale-110' : 'scale-100'} transition-all duration-500`}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: isActive ? 1.15 : 1, y: 0 }}
      transition={{ type: "spring", damping: 15, stiffness: 300, delay: position * 0.1 }}
    >
      <div className={`relative p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl backdrop-blur-sm border-2 transition-all duration-500 ${
        isActive 
          ? 'bg-gradient-to-br from-emerald-500/40 to-emerald-600/50 border-emerald-400 shadow-[0_0_40px_0_rgba(16,185,129,0.8)]' 
          : 'bg-gradient-to-br from-slate-800/90 to-slate-900/95 border-slate-600/50 shadow-xl'
      } ${playerState.status === 'FOLDED' ? 'opacity-60 grayscale' : ''} ${
        playerState.status === 'ALL_IN' ? 'border-amber-500/80 shadow-[0_0_25px_0_rgba(245,158,11,0.6)]' : ''
      }`}>
        
        {/* Active player enhanced glow effect */}
        {isActive && (
          <motion.div 
            className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl sm:rounded-2xl opacity-80 blur-md"
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        
        <div className="relative">
          <PlayerBadges
            isDealer={isDealer}
            isSmallBlind={isSmallBlind}
            isBigBlind={isBigBlind}
            status={playerState.status}
          />
          
          <PlayerAvatar
            initials={initials}
            isCurrentPlayer={isCurrentPlayer}
            isActive={isActive}
          />
          
          <PlayerChipDisplay
            playerName={playerState.playerName}
            playerId={playerState.playerId}
            isCurrentPlayer={isCurrentPlayer}
            stack={playerState.stack}
            currentBet={playerState.currentBet}
          />
          
          <PlayerCards
            holeCards={holeCards}
            status={playerState.status}
          />
        </div>
      </div>
    </motion.div>
  );
}
