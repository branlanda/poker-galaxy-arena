
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameMessages } from '@/components/poker/GameMessages';
import { ChatRoom } from '@/components/poker/ChatRoom';
import { PlayerList } from '@/components/poker/PlayerList';
import { GameState } from '@/types/game';
import { PlayerAtTable } from '@/types/lobby';
import { Award, MessageCircle, Users } from 'lucide-react';

interface GameTabsProps {
  gameState: GameState | null;
  tableId: string;
  players: PlayerAtTable[];
  maxPlayers: number;
  userId: string | undefined;
}

export function GameTabs({ gameState, tableId, players, maxPlayers, userId }: GameTabsProps) {
  return (
    <Tabs defaultValue="actions" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="actions">
          <Award className="h-4 w-4 mr-2" /> Game Actions
        </TabsTrigger>
        <TabsTrigger value="chat">
          <MessageCircle className="h-4 w-4 mr-2" /> Chat
        </TabsTrigger>
        <TabsTrigger value="players">
          <Users className="h-4 w-4 mr-2" /> Players
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="actions" className="border border-emerald/10 rounded-md p-4 bg-navy/30">
        <GameMessages
          action={
            gameState?.lastAction ? {
              playerName: gameState.seats.find(
                s => s !== null && s.playerId === gameState.lastAction?.playerId
              )?.playerName || 'Player',
              action: gameState.lastAction.action,
              amount: gameState.lastAction.amount
            } : undefined
          }
          gamePhase={gameState?.phase}
        />
      </TabsContent>
      
      <TabsContent value="chat" className="border border-emerald/10 rounded-md p-4 bg-navy/30 h-[350px]">
        {tableId && <ChatRoom tableId={tableId} />}
      </TabsContent>
      
      <TabsContent value="players" className="border border-emerald/10 rounded-md p-4 bg-navy/30">
        <PlayerList players={players} maxPlayers={maxPlayers} userId={userId} />
      </TabsContent>
    </Tabs>
  );
}
