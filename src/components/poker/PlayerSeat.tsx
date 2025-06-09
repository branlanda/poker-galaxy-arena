
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerState } from '@/types/poker';
import { Card } from '@/types/poker';
import { PlayerCards } from './player/PlayerCards';
import { PlayerAvatar } from './player/PlayerAvatar';
import { PlayerBadges } from './player/PlayerBadges';
import { PlayerChipDisplay } from './player/PlayerChipDisplay';
import { Button } from '@/components/ui/button';
import { Crown, Star } from 'lucide-react';

interface PlayerSeatProps {
  position: number;
  player?: PlayerState;
  isCurrentPlayer?: boolean;
  isActive?: boolean;
  isDealer?: boolean;
  isSmallBlind?: boolean;
  isBigBlind?: boolean;
  holeCards?: Card[];
  onSitDown?: () => void;
  disabled?: boolean;
}

export const PlayerSeat: React.FC<PlayerSeatProps> = ({
  position,
  player,
  isCurrentPlayer = false,
  isActive = false,
  isDealer = false,
  isSmallBlind = false,
  isBigBlind = false,
  holeCards,
  onSitDown,
  disabled = false
}) => {
  if (!player) {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-emerald-500/50 bg-emerald-900/20 flex items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-900/40 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onSitDown}
            disabled={disabled}
            variant="ghost"
            size="sm"
            className="text-emerald-400 hover:text-emerald-300 text-xs font-medium"
          >
            Sentarse
          </Button>
        </motion.div>
        <div className="text-xs text-gray-500 mt-1">Asiento {position + 1}</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Player's hole cards */}
      <div className="mb-2">
        <PlayerCards
          holeCards={holeCards || player.holeCards}
          status={player.status}
          isCurrentPlayer={isCurrentPlayer}
          size="sm"
          showCards={isCurrentPlayer}
        />
      </div>

      {/* Player info container */}
      <motion.div
        className={`relative flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
          isActive 
            ? 'bg-emerald-900/80 ring-2 ring-emerald-400 shadow-lg shadow-emerald-400/25' 
            : 'bg-slate-800/60'
        } ${isCurrentPlayer ? 'ring-2 ring-blue-400' : ''}`}
        animate={isActive ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Player avatar and name */}
        <div className="flex flex-col items-center">
          <PlayerAvatar
            playerId={player.playerId}
            playerName={player.playerName || `Player ${position + 1}`}
            isActive={isActive}
            size="sm"
          />
          
          <div className="text-center mt-1">
            <div className="text-xs font-medium text-white truncate max-w-20">
              {player.playerName || `Player ${position + 1}`}
            </div>
            <div className="text-xs text-gray-400">
              ${player.stack.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Player badges */}
        <PlayerBadges
          isDealer={isDealer}
          isSmallBlind={isSmallBlind}
          isBigBlind={isBigBlind}
          status={player.status}
          size="sm"
        />

        {/* Current bet display */}
        {player.currentBet > 0 && (
          <PlayerChipDisplay
            amount={player.currentBet}
            size="sm"
            className="mt-1"
          />
        )}

        {/* Active player indicator */}
        {isActive && (
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Star className="w-3 h-3 text-emerald-900" fill="currentColor" />
          </motion.div>
        )}

        {/* Dealer button */}
        {isDealer && (
          <motion.div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-2 border-amber-300 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Crown className="w-4 h-4 text-amber-900" fill="currentColor" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
