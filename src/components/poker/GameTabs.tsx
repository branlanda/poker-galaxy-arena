
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from '@/hooks/useTranslation';
import { MessageSquare, Clock, Users } from 'lucide-react';
import { PlayerAtTable } from '@/types/lobby';
import { GameState } from '@/types/game';
import { PlayerList } from './PlayerList';
import { GameChat } from './GameChat';
import { HandHistory } from './HandHistory';

interface GameTabsProps {
  gameState: GameState | null;
  tableId: string;
  players: PlayerAtTable[];
  maxPlayers: number;
  userId?: string;
}

export function GameTabs({ gameState, tableId, players, maxPlayers, userId }: GameTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("chat");
  
  return (
    <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="chat" className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          {t('chat', 'Chat')}
        </TabsTrigger>
        <TabsTrigger value="players" className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          {t('players', 'Jugadores')} ({players.length}/{maxPlayers})
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          {t('handHistory', 'Historial')}
        </TabsTrigger>
      </TabsList>
      
      <div className="mt-4 border border-emerald/10 rounded-md bg-navy-800/60">
        <TabsContent value="chat" className="m-0">
          <div className="h-64 md:h-80">
            <GameChat tableId={tableId} userId={userId} />
          </div>
        </TabsContent>
        
        <TabsContent value="players" className="m-0">
          <div className="h-64 md:h-80 overflow-y-auto p-4">
            <PlayerList players={players} gameState={gameState} />
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="m-0">
          <div className="h-64 md:h-80 overflow-y-auto p-4">
            <HandHistory />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
