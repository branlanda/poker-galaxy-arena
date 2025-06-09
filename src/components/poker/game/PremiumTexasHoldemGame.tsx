
import React, { useState } from 'react';
import { PremiumPokerTable } from './PremiumPokerTable';
import { PremiumGameControls } from './PremiumGameControls';
import { GameChat } from '../GameChat';
import { PremiumGameHeader } from './PremiumGameHeader';
import { GameState, PlayerState } from '@/types/poker';
import { motion } from 'framer-motion';

interface PremiumTexasHoldemGameProps {
  gameState: GameState;
  players: PlayerState[];
  userId?: string;
  onSitDown: (seatNumber: number) => void;
  onAction: (action: string, amount?: number) => void;
}

export const PremiumTexasHoldemGame: React.FC<PremiumTexasHoldemGameProps> = ({
  gameState,
  players,
  userId,
  onSitDown,
  onAction
}) => {
  const [showChat, setShowChat] = useState(true);
  const playerState = userId ? players.find(p => p.playerId === userId) : undefined;
  const isPlayerTurn = playerState && gameState.activePlayerId === playerState.playerId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900/40 to-black"></div>
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }}></div>
      
      {/* Premium header */}
      <PremiumGameHeader gameState={gameState} playerState={playerState} />

      {/* Main game area */}
      <div className="flex min-h-screen pt-16">
        {/* Game table area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="relative w-full max-w-7xl">
            <PremiumPokerTable
              gameState={gameState}
              players={players}
              userId={userId}
              onSitDown={onSitDown}
              onAction={onAction}
            />
          </div>
        </div>

        {/* Premium sidebar with chat */}
        <motion.div 
          className={`w-80 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-l border-amber-500/20 shadow-2xl ${showChat ? 'translate-x-0' : 'translate-x-full'}`}
          initial={{ x: '100%' }}
          animate={{ x: showChat ? 0 : '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar header */}
            <div className="p-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-600/10 to-blue-600/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Sala de Juego</h3>
                <button 
                  onClick={() => setShowChat(!showChat)}
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {showChat ? '→' : '←'}
                </button>
              </div>
            </div>

            {/* Players list */}
            <div className="p-4 border-b border-amber-500/20">
              <h4 className="text-amber-400 text-sm font-medium mb-3">Jugadores ({players.length}/9)</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-xs font-bold text-black">
                        P
                      </div>
                      <span className="text-white">{player.playerName}</span>
                    </div>
                    <span className="text-amber-400">${player.stack.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1">
              <GameChat 
                tableId={gameState.id} 
                userId={userId}
              />
            </div>

            {/* Quick actions */}
            <div className="p-4 border-t border-amber-500/20 space-y-2">
              <button className="w-full py-2 px-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white rounded-lg transition-all duration-200 text-sm">
                Ver Historial
              </button>
              <button className="w-full py-2 px-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white rounded-lg transition-all duration-200 text-sm">
                Salir de Mesa
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium controls overlay */}
      <PremiumGameControls
        gameState={gameState}
        playerState={playerState}
        isPlayerTurn={!!isPlayerTurn}
        onAction={onAction}
      />

      {/* Chat toggle for mobile */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed right-4 top-20 z-50 w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform lg:hidden"
      >
        💬
      </button>
    </div>
  );
};
