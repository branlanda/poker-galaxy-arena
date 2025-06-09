
import React from 'react';
import { motion } from 'framer-motion';
import { GameState, PlayerState } from '@/types/poker';
import { Crown, Users, DollarSign, Clock, Settings, HelpCircle, Home, Trophy, User, Wallet } from 'lucide-react';

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
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-950/98 via-blue-950/98 to-slate-950/98 backdrop-blur-xl border-b-2 border-amber-500/30 shadow-2xl"
      style={{
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(245,158,11,0.1)'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Enhanced logo and navigation */}
          <div className="flex items-center gap-10">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-xl border-2 border-amber-300"
                   style={{
                     boxShadow: '0 6px 20px rgba(245,158,11,0.5), inset 0 2px 4px rgba(255,255,255,0.3)'
                   }}>
                <Crown className="w-7 h-7 text-black" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
                  POKER GALAXY
                </h1>
                <p className="text-emerald-400 text-xs font-medium">Premium Casino</p>
              </div>
            </motion.div>

            {/* Enhanced navigation with icons */}
            <nav className="hidden lg:flex items-center gap-8">
              <motion.a 
                href="/lobby" 
                className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors font-semibold py-2 px-4 rounded-lg hover:bg-amber-500/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-4 h-4" />
                Lobby
              </motion.a>
              <motion.a 
                href="/tables" 
                className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors font-semibold py-2 px-4 rounded-lg hover:bg-amber-500/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-4 h-4" />
                Mis Mesas
              </motion.a>
              <motion.a 
                href="/tournaments" 
                className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors font-semibold py-2 px-4 rounded-lg hover:bg-amber-500/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trophy className="w-4 h-4" />
                Torneos
              </motion.a>
              <motion.a 
                href="/profile" 
                className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors font-semibold py-2 px-4 rounded-lg hover:bg-amber-500/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-4 h-4" />
                Perfil
              </motion.a>
            </nav>
          </div>

          {/* Enhanced game info center */}
          <div className="flex items-center gap-6">
            <motion.div 
              className="flex items-center gap-6 px-6 py-3 bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-xl border-2 border-amber-500/30 backdrop-blur-sm shadow-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-blue-300 text-xs font-medium">Mesa</div>
                  <div className="text-white text-sm font-bold">#{gameState.id.slice(-4)}</div>
                </div>
              </div>
              
              <div className="w-px h-8 bg-amber-500/40"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-emerald-300 text-xs font-medium">Bote</div>
                  <div className="text-white text-sm font-bold">${gameState.pot.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="w-px h-8 bg-amber-500/40"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-purple-300 text-xs font-medium">Fase</div>
                  <div className="text-white text-sm font-bold">{gameState.phase}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced user info and controls */}
          <div className="flex items-center gap-4">
            {/* Premium player balance */}
            {playerState && (
              <motion.div 
                className="px-6 py-3 bg-gradient-to-r from-emerald-700/60 to-emerald-600/60 rounded-xl border-2 border-emerald-500/40 shadow-xl backdrop-blur-sm"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-emerald-200 text-xs font-medium">Tu Saldo</div>
                <div className="text-emerald-300 text-lg font-bold">
                  ${playerState.stack.toLocaleString()}
                </div>
              </motion.div>
            )}

            {/* Enhanced quick actions */}
            <div className="flex items-center gap-3">
              <motion.button 
                className="w-10 h-10 bg-gradient-to-br from-slate-700/60 to-slate-600/60 hover:from-slate-600/70 hover:to-slate-500/70 rounded-xl flex items-center justify-center transition-all border border-slate-500/40 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings className="w-5 h-5 text-gray-300" />
              </motion.button>
              
              <motion.button 
                className="w-10 h-10 bg-gradient-to-br from-slate-700/60 to-slate-600/60 hover:from-slate-600/70 hover:to-slate-500/70 rounded-xl flex items-center justify-center transition-all border border-slate-500/40 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <HelpCircle className="w-5 h-5 text-gray-300" />
              </motion.button>

              {/* Ver historial button */}
              <motion.button 
                className="px-4 py-2 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-slate-600/70 hover:to-slate-500/70 text-white font-semibold rounded-xl transition-all border border-slate-500/40 shadow-lg text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Historial
              </motion.button>

              {/* Salir de mesa button */}
              <motion.button 
                className="px-4 py-2 bg-gradient-to-r from-red-700/60 to-red-600/60 hover:from-red-600/70 hover:to-red-500/70 text-white font-semibold rounded-xl transition-all border border-red-500/40 shadow-lg text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Salir de Mesa
              </motion.button>
            </div>

            {/* Premium wallet button */}
            <motion.button 
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-xl transition-all duration-200 shadow-xl border-2 border-amber-400/60 flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(245,158,11,0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet className="w-5 h-5" />
              Billetera
            </motion.button>
          </div>
        </div>
      </div>

      {/* Premium glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/3 to-transparent pointer-events-none"></div>
    </motion.header>
  );
};
