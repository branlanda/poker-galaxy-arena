
import React from 'react';
import { GameTitleBar } from './GameTitleBar';
import { GameTable } from './game/GameTable';
import { GameControls } from './game/GameControls';
import { GameChat } from './GameChat';
import { GameInfo } from './GameInfo';
import { PlayerList } from './PlayerList';
import { GameState, PlayerState } from '@/types/poker';
import { PlayerAtTable, LobbyTable } from '@/types/lobby';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Users, BarChart3, RefreshCw, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameRoomContentProps {
  tableId: string;
  tableData: LobbyTable;
  players: PlayerAtTable[];
  gameState: GameState | null;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  isJoining: boolean;
  userId?: string;
  onSitDown: (seatNumber: number) => void;
  onAction: (action: string, amount?: number) => void;
  onLeaveTable: () => void;
}

// Helper function to transform PlayerAtTable to PlayerState
const transformPlayerAtTableToPlayerState = (player: PlayerAtTable): PlayerState => {
  return {
    id: player.id,
    gameId: '',
    playerId: player.player_id,
    playerName: player.player_name || `Player ${player.player_id.substring(0, 4)}`,
    seatNumber: player.seat_number || 0,
    stack: player.stack,
    holeCards: undefined,
    status: player.status as any,
    currentBet: 0,
    isDealer: false,
    isSmallBlind: false,
    isBigBlind: false,
    createdAt: player.joined_at
  };
};

export const GameRoomContent: React.FC<GameRoomContentProps> = ({
  tableId,
  tableData,
  players,
  gameState,
  isPlayerSeated,
  isPlayerTurn,
  isJoining,
  userId,
  onSitDown,
  onAction,
  onLeaveTable
}) => {
  // Transform players data to PlayerState format
  const transformedPlayers: PlayerState[] = players.map(transformPlayerAtTableToPlayerState);
  
  const playerState = isPlayerSeated ? 
    transformedPlayers.find(p => p.playerId === userId) : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col text-white">
      {/* Enhanced Title Bar */}
      <GameTitleBar 
        table={tableData}
        currentPlayers={players.length}
        gamePhase={gameState?.phase}
        pot={gameState?.pot}
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
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Nueva Mesa</span>
            </Button>
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
      
      {/* Main Game Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Game Info and Chat */}
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
              <PlayerList players={transformedPlayers} currentUserId={userId} />
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

        {/* Center - Game Table */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            {gameState ? (
              <GameTable
                game={gameState}
                players={transformedPlayers}
                userId={userId}
                playerHandVisible={true}
                isJoining={isJoining}
                onSitDown={onSitDown}
              />
            ) : (
              <Card className="bg-slate-800/50 border-emerald/20">
                <CardContent className="h-96 flex items-center justify-center">
                  <div className="text-center text-emerald-400">
                    <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white">Cargando mesa de juego...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Game Controls - Fixed at bottom */}
      {isPlayerSeated && gameState && (
        <div className="bg-slate-900/95 backdrop-blur-sm border-t border-emerald/20 p-4">
          <div className="max-w-7xl mx-auto">
            <GameControls
              isPlayerSeated={isPlayerSeated}
              isPlayerTurn={isPlayerTurn}
              playerState={playerState}
              currentBet={gameState.currentBet}
              gamePhase={gameState.phase}
              lastAction={gameState.lastAction}
              onAction={async (action, amount) => {
                onAction(action, amount);
              }}
              onLeaveTable={onLeaveTable}
            />
          </div>
        </div>
      )}
    </div>
  );
};
