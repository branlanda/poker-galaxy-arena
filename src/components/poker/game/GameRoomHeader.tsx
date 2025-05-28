
import React from 'react';
import { GameTitleBar } from '../GameTitleBar';
import { AvailableTablesDropdown } from './AvailableTablesDropdown';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings } from 'lucide-react';
import { LobbyTable } from '@/types/lobby';
import { PlayerAtTable } from '@/types/lobby';

interface GameRoomHeaderProps {
  tableId: string;
  tableData: LobbyTable;
  players: PlayerAtTable[];
  gamePhase?: string;
  pot?: number;
  onTableSelect: (tableId: string) => void;
}

export const GameRoomHeader: React.FC<GameRoomHeaderProps> = ({
  tableId,
  tableData,
  players,
  gamePhase,
  pot,
  onTableSelect
}) => {
  return (
    <>
      {/* Enhanced Title Bar */}
      <GameTitleBar 
        table={tableData}
        currentPlayers={players.length}
        gamePhase={gamePhase}
        pot={pot}
      />
      
      {/* Table Tabs Bar */}
      <div className="bg-slate-800/60 border-b border-emerald/20 px-6 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Tabs defaultValue={tableId} className="flex-1">
              <TabsList className="bg-slate-700/50 border border-emerald/20">
                <TabsTrigger 
                  value={tableId} 
                  className="text-white data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald-300"
                >
                  {tableData.name}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <AvailableTablesDropdown 
              currentTableId={tableId}
              onTableSelect={onTableSelect}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Recargar</span>
            </Button>
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
    </>
  );
};
