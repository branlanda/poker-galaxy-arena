import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gamepad2, Trophy, Zap, MessageSquare, Users, History } from 'lucide-react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { GameChat } from './GameChat';
import { PlayerList } from './PlayerList';
import { HandHistory } from './HandHistory';
import { PlayerAtTable } from '@/types/lobby';
import { GameState } from '@/types/poker';

interface ActiveTable {
  id: string;
  name: string;
  type: 'CASH_GAME' | 'TOURNAMENT' | 'SIT_AND_GO';
  status: string;
  current_players: number;
  max_players: number;
}

export interface GameTabsProps {
  tableId: string;
  players: PlayerAtTable[];
  gameState?: GameState | null;
  userId?: string;
}

export function GameTabs({ tableId, players, gameState, userId }: GameTabsProps) {
  const [tab, setTab] = useState<string>('tables');
  const [activeTables, setActiveTables] = useState<ActiveTable[]>([]);
  const { user } = useAuth();

  // Cargar mesas activas del jugador
  useEffect(() => {
    if (!user?.id) return;

    const fetchActiveTables = async () => {
      try {
        const { data, error } = await supabase
          .from('lobby_tables')
          .select(`
            id,
            name,
            table_type,
            status,
            current_players,
            max_players,
            players_at_table!inner(player_id)
          `)
          .eq('players_at_table.player_id', user.id)
          .in('status', ['WAITING', 'ACTIVE', 'RUNNING']);

        if (error) throw error;

        const tables: ActiveTable[] = data.map(table => ({
          id: table.id,
          name: table.name,
          type: table.table_type as 'CASH_GAME' | 'TOURNAMENT' | 'SIT_AND_GO',
          status: table.status,
          current_players: table.current_players,
          max_players: table.max_players
        }));

        setActiveTables(tables);
      } catch (error) {
        console.error('Error fetching active tables:', error);
      }
    };

    fetchActiveTables();
  }, [user?.id]);

  const getTableIcon = (type: string) => {
    switch (type) {
      case 'CASH_GAME':
        return <Gamepad2 className="w-4 h-4" />;
      case 'TOURNAMENT':
        return <Trophy className="w-4 h-4" />;
      case 'SIT_AND_GO':
        return <Zap className="w-4 h-4" />;
      default:
        return <Gamepad2 className="w-4 h-4" />;
    }
  };

  const getTableTypeLabel = (type: string) => {
    switch (type) {
      case 'CASH_GAME':
        return 'Cash Game';
      case 'TOURNAMENT':
        return 'Torneo';
      case 'SIT_AND_GO':
        return 'Sit & Go';
      default:
        return 'Mesa';
    }
  };

  const cashGames = activeTables.filter(t => t.type === 'CASH_GAME');
  const tournaments = activeTables.filter(t => t.type === 'TOURNAMENT');
  const sitAndGo = activeTables.filter(t => t.type === 'SIT_AND_GO');

  return (
    <div className="bg-slate-900/50 border-t border-emerald/20">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 h-12 bg-slate-800/50">
          <TabsTrigger value="tables" className="text-sm flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            Mesas Activas
            {activeTables.length > 0 && (
              <Badge variant="outline" className="bg-emerald/20 text-emerald-300 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                {activeTables.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="chat" className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="players" className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            Jugadores ({players.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm flex items-center gap-2">
            <History className="w-4 h-4" />
            Historial
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables" className="p-4 mt-0">
          <div className="space-y-4 max-h-64 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Tus Mesas Activas</h3>
            
            {activeTables.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tienes mesas activas</p>
                <p className="text-sm">Únete a una mesa desde el lobby para comenzar a jugar</p>
              </div>
            ) : (
              <>
                {/* Cash Games */}
                {cashGames.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Gamepad2 className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-medium text-emerald-400">Cash Games</h4>
                      <Badge variant="outline" className="bg-emerald/20 text-emerald-300">
                        {cashGames.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {cashGames.map((table) => (
                        <div
                          key={table.id}
                          className={`p-3 rounded-lg border transition-colors ${
                            table.id === tableId
                              ? 'bg-emerald/20 border-emerald/40'
                              : 'bg-slate-800/50 border-slate-700 hover:border-emerald/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-white">{table.name}</h5>
                              <p className="text-sm text-gray-400">
                                {table.current_players}/{table.max_players} jugadores
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {table.id === tableId && (
                                <Badge className="bg-emerald/20 text-emerald-300">
                                  Actual
                                </Badge>
                              )}
                              {table.id !== tableId && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(`/game/${table.id}`, '_blank')}
                                >
                                  Ir a Mesa
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tournaments */}
                {tournaments.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <h4 className="font-medium text-amber-400">Torneos</h4>
                      <Badge variant="outline" className="bg-amber/20 text-amber-300">
                        {tournaments.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {tournaments.map((table) => (
                        <div
                          key={table.id}
                          className={`p-3 rounded-lg border transition-colors ${
                            table.id === tableId
                              ? 'bg-amber/20 border-amber/40'
                              : 'bg-slate-800/50 border-slate-700 hover:border-amber/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-white">{table.name}</h5>
                              <p className="text-sm text-gray-400">
                                {table.current_players}/{table.max_players} jugadores
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {table.id === tableId && (
                                <Badge className="bg-amber/20 text-amber-300">
                                  Actual
                                </Badge>
                              )}
                              {table.id !== tableId && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(`/game/${table.id}`, '_blank')}
                                >
                                  Ir a Mesa
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sit & Go */}
                {sitAndGo.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <h4 className="font-medium text-purple-400">Sit & Go</h4>
                      <Badge variant="outline" className="bg-purple/20 text-purple-300">
                        {sitAndGo.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {sitAndGo.map((table) => (
                        <div
                          key={table.id}
                          className={`p-3 rounded-lg border transition-colors ${
                            table.id === tableId
                              ? 'bg-purple/20 border-purple/40'
                              : 'bg-slate-800/50 border-slate-700 hover:border-purple/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-white">{table.name}</h5>
                              <p className="text-sm text-gray-400">
                                {table.current_players}/{table.max_players} jugadores
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {table.id === tableId && (
                                <Badge className="bg-purple/20 text-purple-300">
                                  Actual
                                </Badge>
                              )}
                              {table.id !== tableId && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(`/game/${table.id}`, '_blank')}
                                >
                                  Ir a Mesa
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="chat" className="p-0 mt-0">
          <GameChat tableId={tableId} userId={userId} />
        </TabsContent>
        
        <TabsContent value="players" className="p-0 mt-0">
          <PlayerList players={players} gameState={gameState} />
        </TabsContent>
        
        <TabsContent value="history" className="p-0 mt-0">
          <HandHistory tableId={tableId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
