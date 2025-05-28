
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Users, DollarSign, Clock, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LobbyTable } from '@/types/lobby';

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
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-emerald/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Back button and table info */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/lobby')}
            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver al Lobby
          </Button>
          
          <div className="h-6 w-px bg-emerald/30" />
          
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              {table.name}
              {table.is_private && (
                <Badge variant="outline" className="bg-amber/20 text-amber-300 border-amber/30">
                  Privada
                </Badge>
              )}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
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
              <div className="text-sm text-gray-400">Bote Total</div>
              <div className="text-lg font-bold text-emerald-400">
                ${pot.toLocaleString()}
              </div>
            </div>
          )}
          
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
