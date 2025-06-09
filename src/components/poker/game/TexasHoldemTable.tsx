
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerState, GameState, Card } from '@/types/poker';
import { RealPokerCard } from '../cards/RealPokerCard';
import { Button } from '@/components/ui/button';
import { Crown, Star, CircleDot } from 'lucide-react';

interface TexasHoldemTableProps {
  gameState: GameState;
  players: PlayerState[];
  userId?: string;
  onSitDown: (seatNumber: number) => void;
  onAction: (action: string, amount?: number) => void;
}

export const TexasHoldemTable: React.FC<TexasHoldemTableProps> = ({
  gameState,
  players,
  userId,
  onSitDown,
  onAction
}) => {
  // Calculate seat positions in a circle (9 seats)
  const seatPositions = Array.from({ length: 9 }, (_, i) => {
    const angle = (i * 2 * Math.PI / 9) - Math.PI / 2;
    const radius = 42; // Percentage radius
    const top = 50 + radius * Math.sin(angle);
    const left = 50 + radius * Math.cos(angle);
    
    return {
      top: `${Math.max(5, Math.min(95, top))}%`,
      left: `${Math.max(5, Math.min(95, left))}%`,
      transform: 'translate(-50%, -50%)'
    };
  });

  // Get player at each seat
  const getPlayerAtSeat = (seatNumber: number) => {
    return players.find(p => p.seatNumber === seatNumber);
  };

  // Check if it's player's turn
  const isPlayerTurn = (playerId: string) => {
    return gameState.activePlayerId === playerId;
  };

  // Render community cards
  const renderCommunityCards = () => {
    const cards = gameState.communityCards || [];
    const visibleCount = getVisibleCardCount();
    
    return (
      <div className="flex justify-center items-center gap-2 mb-4">
        {Array.from({ length: 5 }, (_, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ rotateY: 180, scale: 0.8 }}
            animate={{ 
              rotateY: index < visibleCount ? 0 : 180, 
              scale: index < visibleCount ? 1 : 0.8 
            }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
          >
            {index < cards.length && index < visibleCount ? (
              <RealPokerCard 
                card={cards[index]} 
                size="lg"
                faceDown={false}
                className="shadow-2xl border-2 border-white/20"
              />
            ) : (
              <div className="w-20 h-28 rounded-lg border-2 border-dashed border-white/30 bg-white/10 flex items-center justify-center">
                <div className="text-white/40 text-xs">?</div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  const getVisibleCardCount = () => {
    switch (gameState.phase) {
      case 'PREFLOP':
      case 'WAITING':
        return 0;
      case 'FLOP':
        return 3;
      case 'TURN':
        return 4;
      case 'RIVER':
      case 'SHOWDOWN':
        return 5;
      default:
        return 0;
    }
  };

  // Render individual player seat
  const renderPlayerSeat = (seatNumber: number) => {
    const player = getPlayerAtSeat(seatNumber);
    const position = seatPositions[seatNumber];
    const isCurrentUser = player?.playerId === userId;
    const isActive = player && isPlayerTurn(player.playerId);

    if (!player) {
      return (
        <motion.div
          key={`empty-${seatNumber}`}
          className="absolute"
          style={position}
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-500/50 bg-emerald-900/20 flex items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-900/40 transition-all">
            <Button
              onClick={() => onSitDown(seatNumber)}
              variant="ghost"
              size="sm"
              className="text-emerald-400 hover:text-emerald-300 text-xs"
            >
              Sentarse
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">Asiento {seatNumber + 1}</div>
        </motion.div>
      );
    }

    const playerName = player.playerName || `Player ${seatNumber + 1}`;
    const initials = playerName.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);

    return (
      <motion.div
        key={`player-${seatNumber}`}
        className="absolute"
        style={position}
        animate={isActive ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Player hole cards */}
        <div className="mb-2 flex justify-center gap-1">
          {player.holeCards && player.holeCards.length === 2 ? (
            // Show real cards for current user, card backs for others
            player.holeCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ rotateY: 180, x: index === 0 ? -10 : 10 }}
                animate={{ rotateY: 0, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <RealPokerCard 
                  card={isCurrentUser ? card : undefined}
                  size="sm"
                  faceDown={!isCurrentUser}
                  animate={false}
                />
              </motion.div>
            ))
          ) : (
            // Placeholder cards
            [0, 1].map(index => (
              <div key={index} className="w-12 h-16 rounded border border-gray-600 bg-gray-800/50"></div>
            ))
          )}
        </div>

        {/* Player info */}
        <div className={`relative p-3 rounded-lg transition-all ${
          isActive 
            ? 'bg-emerald-900/80 ring-2 ring-emerald-400 shadow-lg' 
            : 'bg-slate-800/60'
        } ${isCurrentUser ? 'ring-2 ring-blue-400' : ''}`}>
          
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2 mx-auto ${
            isCurrentUser ? 'bg-blue-600' : 'bg-gray-600'
          }`}>
            {initials}
          </div>

          {/* Player name and stack */}
          <div className="text-center">
            <div className="text-xs font-medium text-white truncate max-w-20">
              {playerName}
            </div>
            <div className="text-xs text-gray-400">
              ${player.stack.toLocaleString()}
            </div>
          </div>

          {/* Current bet */}
          {player.currentBet > 0 && (
            <div className="mt-2 text-center">
              <div className="bg-amber-600/90 rounded px-2 py-1 text-xs text-white">
                ${player.currentBet.toLocaleString()}
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {player.isDealer && (
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border border-amber-300">
                <Crown className="w-3 h-3 text-amber-900" fill="currentColor" />
              </div>
            )}
            {player.isSmallBlind && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                SB
              </div>
            )}
            {player.isBigBlind && (
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                BB
              </div>
            )}
          </div>

          {/* Active indicator */}
          {isActive && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <CircleDot className="w-2 h-2 text-emerald-900" fill="currentColor" />
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full h-[600px] max-w-5xl mx-auto">
      {/* Table background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 rounded-full border-8 border-amber-600/80 shadow-2xl">
        {/* Felt texture overlay */}
        <div className="absolute inset-0 bg-emerald-900/50 rounded-full"></div>
        
        {/* Table center area */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-40">
          {/* Community cards */}
          {renderCommunityCards()}
          
          {/* Pot display */}
          {gameState.pot > 0 && (
            <motion.div
              className="bg-gradient-to-r from-amber-600/90 to-amber-500/90 rounded-lg px-4 py-2 border border-amber-400/60 shadow-lg text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-xs text-amber-100">Bote Total</div>
              <div className="text-lg font-bold text-white">
                ${gameState.pot.toLocaleString()}
              </div>
            </motion.div>
          )}
        </div>

        {/* Table logo/watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-emerald-800/20 flex items-center justify-center pointer-events-none z-0">
          <span className="text-emerald-200/20 font-bold text-xl">TEXAS HOLD'EM</span>
        </div>
      </div>

      {/* Player seats */}
      {Array.from({ length: 9 }, (_, seatNumber) => renderPlayerSeat(seatNumber))}

      {/* Game phase indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded-full">
        {gameState.phase} {gameState.phase !== 'WAITING' && `• Bote: $${gameState.pot.toLocaleString()}`}
      </div>
    </div>
  );
};
