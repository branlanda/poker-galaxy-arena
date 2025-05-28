
import React from 'react';
import { motion } from 'framer-motion';
import { TableLayout } from '../TableLayout';
import { PlayerSeat } from '../PlayerSeat';
import { CommunityCards } from '../CommunityCards';
import { GameState, PlayerState, GamePhase } from '@/types/poker';

interface GameTableProps {
  game: GameState;
  players: PlayerState[];
  userId?: string;
  playerHandVisible: boolean;
  isJoining: boolean;
  onSitDown: (seatNumber: number) => void;
}

export const GameTable: React.FC<GameTableProps> = ({
  game,
  players,
  userId,
  playerHandVisible,
  isJoining,
  onSitDown
}) => {
  // Get seats with players
  const occupiedSeats = players.reduce<Record<number, PlayerState>>((acc, player) => {
    acc[player.seatNumber] = player;
    return acc;
  }, {});
  
  // Determine max number of seats
  const maxSeats = 9;
  
  // Enhanced seat positions for better circular layout
  const seatPositions = [
    { top: '82%', left: '50%', transform: 'translate(-50%, -50%)' },     // Seat 0 - Bottom center
    { top: '70%', left: '20%', transform: 'translate(-50%, -50%)' },     // Seat 1 - Bottom left
    { top: '45%', left: '8%', transform: 'translate(-50%, -50%)' },      // Seat 2 - Middle left
    { top: '20%', left: '20%', transform: 'translate(-50%, -50%)' },     // Seat 3 - Top left
    { top: '12%', left: '40%', transform: 'translate(-50%, -50%)' },     // Seat 4 - Top left-center
    { top: '12%', left: '60%', transform: 'translate(-50%, -50%)' },     // Seat 5 - Top right-center
    { top: '20%', left: '80%', transform: 'translate(-50%, -50%)' },     // Seat 6 - Top right
    { top: '45%', left: '92%', transform: 'translate(-50%, -50%)' },     // Seat 7 - Middle right
    { top: '70%', left: '80%', transform: 'translate(-50%, -50%)' },     // Seat 8 - Bottom right
  ];

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 rounded-full border-8 border-amber-600/80 shadow-2xl overflow-hidden">
      {/* Table felt texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/30 to-emerald-900/50 rounded-full"></div>
      
      {/* Center area for community cards and pot */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-40 flex flex-col items-center justify-center">
        {/* Community cards */}
        <CommunityCards 
          cards={game.communityCards || []} 
          phase={game.phase as GamePhase} 
        />
        
        {/* Pot display */}
        {game.pot > 0 && (
          <motion.div
            className="mt-4 bg-gradient-to-r from-amber-600/90 to-amber-500/90 rounded-lg px-4 py-2 border border-amber-400/60 shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="text-xs text-amber-100 font-medium">Bote Total</div>
              <div className="text-lg font-bold text-white">
                ${game.pot.toLocaleString()}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Render all seats */}
      {Array.from({ length: maxSeats }, (_, seatIndex) => {
        const player = occupiedSeats[seatIndex];
        const isCurrentPlayer = player?.playerId === userId;
        const isActive = game.activeSeat === seatIndex;
        const position = seatPositions[seatIndex];
        
        return (
          <div
            key={seatIndex}
            className="absolute"
            style={{
              top: position.top,
              left: position.left,
              transform: position.transform
            }}
          >
            <PlayerSeat
              position={seatIndex}
              player={player}
              isCurrentPlayer={isCurrentPlayer}
              isActive={isActive}
              isDealer={player?.isDealer ?? false}
              isSmallBlind={player?.isSmallBlind ?? false}
              isBigBlind={player?.isBigBlind ?? false}
              holeCards={isCurrentPlayer && playerHandVisible ? player?.holeCards : undefined}
              onSitDown={() => onSitDown(seatIndex)}
              disabled={isJoining || !!player}
            />
          </div>
        );
      })}
      
      {/* Dealer button */}
      {game.dealerSeat !== undefined && occupiedSeats[game.dealerSeat] && (
        <motion.div
          className="absolute z-20"
          style={{
            top: seatPositions[game.dealerSeat].top,
            left: seatPositions[game.dealerSeat].left,
            transform: 'translate(-50%, -80px)'
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10 }}
        >
          <div className="bg-white text-black font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-black shadow-lg">
            D
          </div>
        </motion.div>
      )}
      
      {/* Game statistics overlay */}
      <motion.div
        className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-emerald/20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="text-xs text-emerald-300 space-y-1">
          <div className="text-white">Jugadores: {players.length}/{maxSeats}</div>
          <div className="text-emerald-400">Fase: {game.phase}</div>
          {game.activeSeat !== undefined && (
            <div className="text-amber-400">Turno: Asiento {game.activeSeat + 1}</div>
          )}
        </div>
      </motion.div>
      
      {/* Table logo in center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-emerald-800/20 flex items-center justify-center pointer-events-none z-0">
        <span className="text-emerald-200/30 font-bold text-sm">POKER</span>
      </div>
    </div>
  );
};
