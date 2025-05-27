
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameTable } from './GameTable';
import { GameControls } from './GameControls';
import { GameState, PlayerState } from '@/types/poker';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: GameState;
  players: PlayerState[];
  userId?: string;
  playerHandVisible: boolean;
  isJoining: boolean;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  playerState?: PlayerState;
  onSitDown: (seatNumber: number) => void;
  onAction: (action: string, amount?: number) => void;
  onLeaveTable: () => void;
  onToggleHandVisibility: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  onClose,
  game,
  players,
  userId,
  playerHandVisible,
  isJoining,
  isPlayerSeated,
  isPlayerTurn,
  playerState,
  onSitDown,
  onAction,
  onLeaveTable,
  onToggleHandVisibility
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className={`fixed z-50 bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-emerald/20 ${
              isMaximized 
                ? 'inset-4' 
                : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[90vh] max-w-7xl'
            }`}
            initial={{ 
              scale: 0.8, 
              opacity: 0,
              y: 50
            }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: 0
            }}
            exit={{ 
              scale: 0.8, 
              opacity: 0,
              y: 50
            }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300 
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-emerald/20">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white">
                  Poker Galaxy Arena
                </h2>
                <Badge className="bg-emerald/20 text-emerald-300">
                  {game.phase}
                </Badge>
                {game.pot > 0 && (
                  <Badge className="bg-amber/20 text-amber-300">
                    Pot: ${game.pot.toLocaleString()}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  <Bell className="w-4 h-4" />
                </Button>
                
                {/* Settings */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-emerald-400 hover:text-emerald-300"
                  onClick={onToggleHandVisibility}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                {/* Maximize/Minimize */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  {isMaximized ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
                
                {/* Close */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onClose}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 p-4 overflow-hidden">
              <div className="h-full flex flex-col">
                {/* Game Table */}
                <div className="flex-1 mb-4">
                  <GameTable
                    game={game}
                    players={players}
                    userId={userId}
                    playerHandVisible={playerHandVisible}
                    isJoining={isJoining}
                    onSitDown={onSitDown}
                  />
                </div>
                
                {/* Game Controls */}
                {isPlayerSeated && (
                  <GameControls
                    isPlayerSeated={isPlayerSeated}
                    isPlayerTurn={isPlayerTurn}
                    playerState={playerState}
                    currentBet={game.currentBet}
                    gamePhase={game.phase}
                    lastAction={undefined}
                    onAction={onAction}
                    onLeaveTable={onLeaveTable}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
