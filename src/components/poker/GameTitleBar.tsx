
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Users, DollarSign, Settings, Home, Trophy, Coins, Target, Zap, RefreshCw, Maximize, Minimize, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LobbyTable } from '@/types/lobby';
import { Logo } from '@/assets/Logo';

interface GameTitleBarProps {
  table: LobbyTable;
  currentPlayers: number;
  gamePhase?: string;
  pot?: number;
}

export const GameTitleBar: React.FC<GameTitleBarProps> = ({
  table,
  currentPlayers,
  gamePhase,
  pot
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-emerald/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center">
              <Logo size="sm" />
            </div>
            
            <div className="h-8 w-px bg-emerald/30" />
            
            {/* Enhanced Navigation */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10 flex items-center gap-2 transition-all duration-200 px-3 py-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Inicio</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/lobby')}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10 flex items-center gap-2 transition-all duration-200 px-3 py-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Lobby</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tournaments')}
                className="text-gray-400 hover:text-emerald-300 hover:bg-emerald/10 flex items-center gap-2 transition-all duration-200 px-3 py-2"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden md:inline font-medium">Torneos</span>
              </Button>
            </div>
          </div>

          {/* Center - Enhanced Table Info */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-3">
                <h1 className="text-2xl font-bold text-white tracking-wide">
                  {table.name}
                </h1>
                <div className="flex items-center gap-2">
                  {table.is_private && (
                    <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-400/50 text-xs font-semibold px-2 py-1">
                      <Zap className="w-3 h-3 mr-1" />
                      Privada
                    </Badge>
                  )}
                  {gamePhase && (
                    <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-400/50 text-xs font-semibold px-2 py-1">
                      <Target className="w-3 h-3 mr-1" />
                      {gamePhase}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-600/10 rounded-lg border border-emerald-400/20">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">${table.small_blind}/{table.big_blind}</span>
                  <span className="text-emerald-400/70 text-xs">Stakes</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/10 rounded-lg border border-blue-400/20">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-blue-300">{currentPlayers}/{table.max_players}</span>
                  <span className="text-blue-400/70 text-xs">Jugadores</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced Controls */}
          <div className="flex items-center gap-3">
            {/* Pot Display */}
            {pot !== undefined && pot > 0 && (
              <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 border border-emerald-400/30 rounded-xl px-4 py-3 text-center shadow-lg">
                <div className="text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1 mb-1">
                  <Coins className="w-3 h-3" />
                  Bote Total
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  ${pot.toLocaleString()}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10 transition-all duration-200 p-2"
                title="Recargar"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 p-2"
                title="Sonido"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 p-2"
                title="Pantalla completa"
              >
                <Maximize className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 p-2"
                title="Configuración"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
