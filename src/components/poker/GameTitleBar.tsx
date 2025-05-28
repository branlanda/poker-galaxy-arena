
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Users, DollarSign, Clock, Settings, Home, Trophy } from 'lucide-react';
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
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-emerald/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center">
              <Logo size="sm" />
            </div>
            
            <div className="h-8 w-px bg-emerald/30" />
            
            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/lobby')}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Lobby
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tournaments')}
                className="text-gray-400 hover:text-emerald-300 hover:bg-emerald/10 flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Tournaments
              </Button>
            </div>
          </div>

          {/* Center - Table Info */}
          <div className="flex-1 max-w-md mx-8">
            <div className="text-center">
              <h1 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                {table.name}
                {table.is_private && (
                  <Badge variant="outline" className="bg-amber/20 text-amber-300 border-amber/30 text-xs">
                    Private
                  </Badge>
                )}
              </h1>
              <div className="flex items-center justify-center gap-4 mt-1 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${table.small_blind}/{table.big_blind}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {currentPlayers}/{table.max_players}
                </div>
                {gamePhase && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {gamePhase}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Game stats and actions */}
          <div className="flex items-center gap-4">
            {pot !== undefined && pot > 0 && (
              <div className="text-right">
                <div className="text-sm text-gray-400">Total Pot</div>
                <div className="text-lg font-bold text-emerald-400">
                  ${pot.toLocaleString()}
                </div>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-slate-700/50"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
