
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  Target, 
  Clock, 
  DollarSign,
  BarChart3,
  Calendar,
  Award,
  Users
} from 'lucide-react';

interface DetailedStats {
  // Basic Stats
  totalHands: number;
  totalGames: number;
  winRate: number;
  profitLoss: number;
  biggestWin: number;
  biggestLoss: number;
  
  // Advanced Stats
  vpip: number; // Voluntarily Put in Pot
  pfr: number; // Pre-flop Raise
  aggression: number;
  tightness: number;
  cBet: number; // Continuation Bet
  foldToCBet: number;
  
  // Positional Stats
  positionalStats: {
    position: string;
    hands: number;
    winRate: number;
    profit: number;
  }[];
  
  // Time-based Stats
  monthlyStats: {
    month: string;
    hands: number;
    profit: number;
    winRate: number;
  }[];
  
  // Tournament Stats
  tournamentStats: {
    played: number;
    won: number;
    finalTables: number;
    avgFinish: number;
    roi: number;
  };
  
  // Hand Strength Stats
  handStrengthStats: {
    strength: string;
    frequency: number;
    winRate: number;
    profit: number;
  }[];
}

export const DetailedPlayerStats: React.FC<{ playerId?: string }> = ({ playerId }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  
  const targetPlayerId = playerId || user?.id;

  useEffect(() => {
    const fetchDetailedStats = async () => {
      if (!targetPlayerId) return;
      
      try {
        setLoading(true);
        
        // Fetch from multiple tables to build comprehensive stats
        const [
          { data: gameHistory },
          { data: handHistory },
          { data: tournamentHistory },
          { data: playerStats }
        ] = await Promise.all([
          supabase.from('game_history').select('*').eq('player_id', targetPlayerId),
          supabase.from('detailed_hand_history').select('*').eq('player_id', targetPlayerId),
          supabase.from('player_tournament_history').select('*').eq('player_id', targetPlayerId),
          supabase.from('player_statistics').select('*').eq('player_id', targetPlayerId).single()
        ]);

        // Calculate comprehensive stats
        const calculatedStats: DetailedStats = {
          totalHands: handHistory?.length || 0,
          totalGames: gameHistory?.length || 0,
          winRate: playerStats?.win_rate || 0,
          profitLoss: playerStats?.total_winnings || 0,
          biggestWin: playerStats?.biggest_win || 0,
          biggestLoss: playerStats?.biggest_loss || 0,
          
          // Simulated advanced stats (would be calculated from actual hand data)
          vpip: 24.5,
          pfr: 18.2,
          aggression: 2.8,
          tightness: 15.6,
          cBet: 68.4,
          foldToCBet: 45.2,
          
          positionalStats: [
            { position: 'Early', hands: 156, winRate: 52.3, profit: 124.50 },
            { position: 'Middle', hands: 203, winRate: 58.1, profit: 298.75 },
            { position: 'Late', hands: 187, winRate: 61.2, profit: 345.20 },
            { position: 'Blinds', hands: 94, winRate: 45.7, profit: -89.30 }
          ],
          
          monthlyStats: [
            { month: 'Enero', hands: 245, profit: 567.80, winRate: 56.7 },
            { month: 'Febrero', hands: 198, profit: 324.50, winRate: 54.2 },
            { month: 'Marzo', hands: 276, profit: 789.20, winRate: 59.1 }
          ],
          
          tournamentStats: {
            played: tournamentHistory?.[0]?.tournaments_played || 0,
            won: tournamentHistory?.[0]?.tournaments_won || 0,
            finalTables: tournamentHistory?.[0]?.tournaments_final_table || 0,
            avgFinish: 12.4,
            roi: tournamentHistory?.[0]?.roi || 0
          },
          
          handStrengthStats: [
            { strength: 'Premium (AA-KK)', frequency: 2.3, winRate: 78.5, profit: 234.70 },
            { strength: 'Strong (QQ-JJ)', frequency: 1.8, winRate: 65.2, profit: 156.40 },
            { strength: 'Good (AK-AQ)', frequency: 4.1, winRate: 58.7, profit: 198.30 },
            { strength: 'Speculative', frequency: 12.4, winRate: 45.1, profit: -45.20 }
          ]
        };
        
        setStats(calculatedStats);
      } catch (error) {
        console.error('Error fetching detailed stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedStats();
  }, [targetPlayerId, timeRange]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-slate-600 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <p className="text-center text-gray-400">No hay estadísticas disponibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Manos Jugadas</CardTitle>
            <BarChart3 className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalHands.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Total histórico</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Winrate</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">{stats.winRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-400">Ratio de victorias</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">P&L Total</CardTitle>
            <DollarSign className={`h-4 w-4 ${stats.profitLoss >= 0 ? 'text-emerald' : 'text-red-400'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.profitLoss >= 0 ? 'text-emerald' : 'text-red-400'}`}>
              {stats.profitLoss >= 0 ? '+' : ''}Ξ{stats.profitLoss.toFixed(2)}
            </div>
            <p className="text-xs text-gray-400">Ganancia/Pérdida</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Mayor Ganancia</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">Ξ{stats.biggestWin.toFixed(2)}</div>
            <p className="text-xs text-gray-400">Mejor sesión</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="advanced" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="advanced">Estadísticas Avanzadas</TabsTrigger>
          <TabsTrigger value="positional">Por Posición</TabsTrigger>
          <TabsTrigger value="temporal">Temporal</TabsTrigger>
          <TabsTrigger value="tournaments">Torneos</TabsTrigger>
        </TabsList>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-emerald">Estadísticas de Juego</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">VPIP</span>
                    <span className="text-white">{stats.vpip}%</span>
                  </div>
                  <Progress value={stats.vpip} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">PFR (Pre-flop Raise)</span>
                    <span className="text-white">{stats.pfr}%</span>
                  </div>
                  <Progress value={stats.pfr} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Agresividad</span>
                    <span className="text-white">{stats.aggression}</span>
                  </div>
                  <Progress value={(stats.aggression / 5) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-emerald">Tendencias de Apuesta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">C-Bet</span>
                    <span className="text-white">{stats.cBet}%</span>
                  </div>
                  <Progress value={stats.cBet} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fold to C-Bet</span>
                    <span className="text-white">{stats.foldToCBet}%</span>
                  </div>
                  <Progress value={stats.foldToCBet} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tightness</span>
                    <span className="text-white">{stats.tightness}%</span>
                  </div>
                  <Progress value={stats.tightness} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positional" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-emerald">Rendimiento por Posición</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.positionalStats.map((pos, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{pos.position}</Badge>
                      <div>
                        <div className="text-white font-medium">{pos.hands} manos</div>
                        <div className="text-gray-400 text-sm">{pos.winRate}% winrate</div>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${pos.profit >= 0 ? 'text-emerald' : 'text-red-400'}`}>
                      {pos.profit >= 0 ? '+' : ''}Ξ{pos.profit.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temporal" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-emerald">Progreso Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.monthlyStats.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-white font-medium">{month.month}</div>
                        <div className="text-gray-400 text-sm">{month.hands} manos • {month.winRate}% winrate</div>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${month.profit >= 0 ? 'text-emerald' : 'text-red-400'}`}>
                      {month.profit >= 0 ? '+' : ''}Ξ{month.profit.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tournaments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-emerald">Estadísticas de Torneos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Torneos Jugados</span>
                  <span className="text-white font-bold">{stats.tournamentStats.played}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Victorias</span>
                  <span className="text-emerald font-bold">{stats.tournamentStats.won}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mesas Finales</span>
                  <span className="text-yellow-400 font-bold">{stats.tournamentStats.finalTables}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Posición Promedio</span>
                  <span className="text-white font-bold">{stats.tournamentStats.avgFinish.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-emerald">ROI por Fuerza de Mano</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.handStrengthStats.map((hand, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{hand.strength}</span>
                      <span className={`font-bold ${hand.profit >= 0 ? 'text-emerald' : 'text-red-400'}`}>
                        {hand.profit >= 0 ? '+' : ''}Ξ{hand.profit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{hand.frequency}% frecuencia</span>
                      <span>{hand.winRate}% winrate</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
