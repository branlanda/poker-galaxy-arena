
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Users, DollarSign, Clock, Settings, Home, Trophy, Coins, Target, Zap } from 'lucide-react';
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
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-emerald/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Navigation */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center">
              <Logo size="sm" />
            </div>
            
            <div className="h-6 w-px bg-emerald/30" />
            
            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10 flex items-center gap-2 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Inicio</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/lobby')}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10 flex items-center gap-2 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Lobby</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tournaments')}
                className="text-gray-400 hover:text-emerald-300 hover:bg-emerald/10 flex items-center gap-2 transition-all duration-200"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden md:inline">Torneos</span>
              </Button>
            </div>
          </div>

          {/* Center - Table Info */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-white">
                  {table.name}
                </h1>
                {table.is_private && (
                  <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-400/40 text-xs font-medium">
                    <Zap className="w-3 h-3 mr-1" />
                    Privada
                  </Badge>
                )}
                {gamePhase && (
                  <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-400/40 text-xs font-medium">
                    <Target className="w-3 h-3 mr-1" />
                    {gamePhase}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">${table.small_blind}/{table.big_blind}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{currentPlayers}/{table.max_players}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Game stats and actions */}
          <div className="flex items-center gap-4">
            {pot !== undefined && pot > 0 && (
              <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 border border-emerald-400/30 rounded-lg px-4 py-2 text-center">
                <div className="text-xs text-emerald-300 font-medium flex items-center justify-center gap-1">
                  <Coins className="w-3 h-3" />
                  Bote Total
                </div>
                <div className="text-lg font-bold text-emerald-400">
                  ${pot.toLocaleString()}
                </div>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
