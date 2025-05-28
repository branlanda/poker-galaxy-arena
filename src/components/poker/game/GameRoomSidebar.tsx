
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Users, BarChart3 } from 'lucide-react';
import { GameChat } from '../GameChat';
import { PlayerList } from '../PlayerList';
import { GameInfo } from '../GameInfo';
import { PlayerAtTable } from '@/types/lobby';
import { GameState } from '@/types/poker';

interface GameRoomSidebarProps {
  tableId: string;
  userId?: string;
  players: PlayerAtTable[];
  gameState: GameState | null;
  tableData: {
    small_blind: number;
    big_blind: number;
  };
}

export const GameRoomSidebar: React.FC<GameRoomSidebarProps> = ({
  tableId,
  userId,
  players,
  gameState,
  tableData
}) => {
  return (
    <div className="w-80 border-r border-emerald/20 bg-slate-900/50 flex flex-col">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-b border-emerald/20">
          <TabsTrigger value="chat" className="text-white data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald-300">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="players" className="text-white data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald-300">
            <Users className="w-4 h-4 mr-2" />
            Jugadores
          </TabsTrigger>
          <TabsTrigger value="info" className="text-white data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald-300">
            <BarChart3 className="w-4 h-4 mr-2" />
            Info
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 m-0 p-0">
          <GameChat tableId={tableId} userId={userId} />
        </TabsContent>
        
        <TabsContent value="players" className="flex-1 m-0 p-2">
          <PlayerList players={players} gameState={gameState} />
        </TabsContent>
        
        <TabsContent value="info" className="flex-1 m-0 p-2">
          {gameState && (
            <GameInfo 
              gamePhase={gameState.phase}
              lastAction={gameState.lastAction}
              smallBlind={tableData.small_blind}
              bigBlind={tableData.big_blind}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
