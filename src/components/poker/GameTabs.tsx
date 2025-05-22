
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, MessageCircle, Users, Info } from 'lucide-react';
import { GameState } from '@/types/game';
import { PlayerAtTable } from '@/types/lobby';
import { GameChat } from './GameChat';
import { PlayerList } from './PlayerList';
import { GameInfo } from './GameInfo';

interface GameTabsProps {
  gameState: GameState | null;
  tableId: string;
  players: PlayerAtTable[];
  maxPlayers: number;
  userId: string | undefined;
}

export function GameTabs({ 
  gameState, 
  tableId, 
  players, 
  maxPlayers, 
  userId 
}: GameTabsProps) {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="info">
          <Info className="h-4 w-4 mr-2" /> Game Info
        </TabsTrigger>
        <TabsTrigger value="chat">
          <MessageCircle className="h-4 w-4 mr-2" /> Chat
        </TabsTrigger>
        <TabsTrigger value="players">
          <Users className="h-4 w-4 mr-2" /> Players
        </TabsTrigger>
        <TabsTrigger value="history">
          <Award className="h-4 w-4 mr-2" /> Hand History
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="border border-emerald/10 rounded-md p-4 bg-navy/30">
        <GameInfo 
          gamePhase={gameState?.phase || 'WAITING'} 
          lastAction={gameState?.lastAction}
          smallBlind={gameState?.smallBlind || 0}
          bigBlind={gameState?.bigBlind || 0}
        />
      </TabsContent>
      
      <TabsContent value="chat" className="border border-emerald/10 rounded-md p-4 bg-navy/30 h-[350px]">
        <GameChat tableId={tableId} />
      </TabsContent>
      
      <TabsContent value="players" className="border border-emerald/10 rounded-md p-4 bg-navy/30">
        <PlayerList 
          players={players}
          maxPlayers={maxPlayers}
          userId={userId}
        />
      </TabsContent>
      
      <TabsContent value="history" className="border border-emerald/10 rounded-md p-4 bg-navy/30">
        <div className="space-y-4">
          <h3 className="text-sm font-medium mb-2 text-gray-300">Hand History</h3>
          <p className="text-xs text-gray-400 italic">
            Recent hands will appear here as they are played
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
