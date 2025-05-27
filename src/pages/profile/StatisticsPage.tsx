
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { TrendingUp, TrendingDown, DollarSign, Trophy, Target, Clock, Users, BarChart3 } from 'lucide-react';

const StatisticsPage = () => {
  const { t } = useTranslation();

  // Mock data - en un entorno real esto vendría de la API
  const stats = {
    totalGames: 324,
    wins: 187,
    losses: 137,
    winRate: 57.7,
    totalEarnings: 12450,
    totalHours: 89,
    avgSessionLength: 45,
    bestStreak: 12,
    currentStreak: 3,
    favoriteGameType: 'Texas Hold\'em',
    totalTournaments: 23,
    tournamentWins: 5
  };

  const recentGames = [
    { id: 1, type: 'Cash Game', result: '+250', date: '2024-01-15', duration: '2h 15m' },
    { id: 2, type: 'Tournament', result: '+850', date: '2024-01-14', duration: '3h 45m' },
    { id: 3, type: 'Cash Game', result: '-125', date: '2024-01-13', duration: '1h 30m' },
    { id: 4, type: 'Cash Game', result: '+420', date: '2024-01-12', duration: '2h 45m' },
    { id: 5, type: 'Tournament', result: '-50', date: '2024-01-11', duration: '45m' }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald mb-2">
            {t('profile.statistics', 'Estadísticas')}
          </h1>
          <p className="text-gray-400">
            {t('profile.statisticsDescription', 'Revisa tu rendimiento y progreso en el juego')}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Juegos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalGames}</div>
              <div className="flex items-center text-sm text-emerald">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12 esta semana
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Tasa de Victoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.winRate}%</div>
              <div className="flex items-center text-sm text-emerald">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.1% este mes
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Ganancias Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${stats.totalEarnings.toLocaleString()}</div>
              <div className="flex items-center text-sm text-emerald">
                <TrendingUp className="h-3 w-3 mr-1" />
                +$850 esta semana
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Tiempo Jugado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalHours}h</div>
              <div className="flex items-center text-sm text-gray-400">
                Promedio: {stats.avgSessionLength}m por sesión
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-emerald flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Logros de Juego
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Mejor Racha</span>
                <Badge variant="secondary" className="bg-emerald/20 text-emerald">
                  {stats.bestStreak} victorias
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Racha Actual</span>
                <Badge variant="secondary" className="bg-blue/20 text-blue-400">
                  {stats.currentStreak} victorias
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Juego Favorito</span>
                <span className="text-white">{stats.favoriteGameType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Torneos Ganados</span>
                <span className="text-white">{stats.tournamentWins}/{stats.totalTournaments}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-emerald flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Juegos Recientes
              </CardTitle>
              <CardDescription className="text-gray-400">
                Últimas 5 sesiones de juego
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentGames.map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-3 rounded-lg bg-navy/50">
                    <div>
                      <div className="font-medium text-white">{game.type}</div>
                      <div className="text-sm text-gray-400">{game.date} • {game.duration}</div>
                    </div>
                    <div className={`font-semibold ${
                      game.result.startsWith('+') ? 'text-emerald' : 'text-red-400'
                    }`}>
                      {game.result}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default StatisticsPage;
