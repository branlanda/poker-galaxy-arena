
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameChat } from './GameChat';
import { PlayerList } from './PlayerList';
import { HandHistory } from './HandHistory';
import { PlayerAtTable } from '@/types/lobby';
import { GameState } from '@/types/game';

interface GameTabsProps {
  tableId: string;
  players: PlayerAtTable[];
  gameState?: GameState | null;
  userId?: string;
  maxPlayers?: number;
}

export function GameTabs({ tableId, players, gameState, userId, maxPlayers }: GameTabsProps) {
  const [tab, setTab] = useState<string>('chat');
  
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="w-full grid grid-cols-3 h-12">
        <TabsTrigger value="chat" className="text-sm">
          Chat
        </TabsTrigger>
        <TabsTrigger value="players" className="text-sm">
          Players ({players.length})
        </TabsTrigger>
        <TabsTrigger value="history" className="text-sm">
          History
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="p-0 mt-4">
        <GameChat tableId={tableId} userId={userId} />
      </TabsContent>
      
      <TabsContent value="players" className="p-0 mt-4">
        <PlayerList players={players} gameState={gameState} />
      </TabsContent>
      
      <TabsContent value="history" className="p-0 mt-4">
        <HandHistory tableId={tableId} />
      </TabsContent>
    </Tabs>
  );
}
