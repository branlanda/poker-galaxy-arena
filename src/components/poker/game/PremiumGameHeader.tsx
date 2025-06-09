
import React from 'react';
import { motion } from 'framer-motion';
import { GameState, PlayerState } from '@/types/poker';
import { Crown, Users, DollarSign, Clock, Settings, HelpCircle } from 'lucide-react';

interface PremiumGameHeaderProps {
  gameState: GameState;
  playerState?: PlayerState;
}

export const PremiumGameHeader: React.FC<PremiumGameHeaderProps> = ({
  gameState,
  playerState
}) => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-slate-900/95 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo and navigation */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-black" fill="currentColor" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                POKER GALAXY
              </h1>
            </div>

            {/* Premium navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/lobby" className="text-white hover:text-amber-400 transition-colors font-medium">
                Lobby
              </a>
              <a href="/tables" className="text-white hover:text-amber-400 transition-colors font-medium">
                Mis Mesas
              </a>
              <a href="/tournaments" className="text-white hover:text-amber-400 transition-colors font-medium">
                Torneos
              </a>
              <a href="/profile" className="text-white hover:text-amber-400 transition-colors font-medium">
                Perfil
              </a>
            </nav>
          </div>

          {/* Game info center */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-4 py-2 bg-slate-800/50 rounded-lg border border-amber-500/20">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="text-white text-sm">Mesa #{gameState.id.slice(-4)}</span>
              </div>
              <div className="w-px h-4 bg-amber-500/30"></div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-white text-sm">Bote: ${gameState.pot.toLocaleString()}</span>
              </div>
              <div className="w-px h-4 bg-amber-500/30"></div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm">{gameState.phase}</span>
              </div>
            </div>
          </div>

          {/* User info and controls */}
          <div className="flex items-center gap-4">
            {/* Player balance */}
            {playerState && (
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-700/50 to-emerald-600/50 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-300 text-sm font-medium">
                  ${playerState.stack.toLocaleString()}
                </span>
              </div>
            )}

            {/* Quick actions */}
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg flex items-center justify-center transition-colors">
                <Settings className="w-4 h-4 text-gray-300" />
              </button>
              <button className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg flex items-center justify-center transition-colors">
                <HelpCircle className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            {/* Premium wallet button */}
            <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-105">
              Billetera
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
