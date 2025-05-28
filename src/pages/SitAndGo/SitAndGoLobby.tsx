import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SitAndGoCard } from '@/components/sitAndGo/SitAndGoCard';
import { CreateSitAndGoDialog } from '@/components/sitAndGo/CreateSitAndGoDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Search, Zap, Clock, Trophy } from 'lucide-react';
import { useSitAndGo } from '@/hooks/useSitAndGo';
import { useAuth } from '@/stores/auth';
import { Link } from 'react-router-dom';

export default function SitAndGoLobby() {
  const { games, loading, createGame, joinGame, leaveGame, refreshGames } = useSitAndGo();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || game.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || game.game_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const waitingGames = filteredGames.filter(g => g.status === 'WAITING');
  const runningGames = filteredGames.filter(g => g.status === 'RUNNING');
  const completedGames = filteredGames.filter(g => g.status === 'COMPLETED');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <AppLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald"></div>
          </div>
        </AppLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Sit & Go Tournaments</h1>
              <p className="text-gray-400 mt-1">Fast-paced single table tournaments</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="bg-slate-800/40 border-emerald/20 hover:bg-slate-700/50">
                <Link to="/tournaments" className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Multi-Table Tournaments
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-800/40 border-emerald/20 hover:bg-slate-700/50">
                <Link to="/lobby" className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Cash Games
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshGames}
                disabled={loading}
                className="bg-slate-800/40 border-emerald/20 hover:bg-slate-700/50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {user && <CreateSitAndGoDialog onCreateGame={createGame} />}
            </div>
          </div>

          {/* Game Type Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/30 rounded-lg p-4 border border-emerald/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-white">Regular</h3>
              </div>
              <p className="text-sm text-gray-400">10 minute blind levels for strategic play</p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 border border-emerald/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <h3 className="font-semibold text-white">Turbo</h3>
              </div>
              <p className="text-sm text-gray-400">5 minute blind levels for faster action</p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 border border-emerald/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-orange-400" />
                <h3 className="font-semibold text-white">Hyper Turbo</h3>
              </div>
              <p className="text-sm text-gray-400">3 minute blind levels for ultra-fast games</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/60 border-emerald/20 text-white placeholder-gray-400"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-slate-800/60 border-emerald/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="WAITING">Waiting</SelectItem>
                <SelectItem value="RUNNING">Running</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 bg-slate-800/60 border-emerald/20">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="TURBO">Turbo</SelectItem>
                <SelectItem value="HYPER_TURBO">Hyper Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {waitingGames.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Waiting for Players ({waitingGames.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {waitingGames.map((game) => (
                  <SitAndGoCard
                    key={game.id}
                    game={game}
                    onJoin={joinGame}
                    onLeave={leaveGame}
                  />
                ))}
              </div>
            </div>
          )}

          {runningGames.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald animate-pulse rounded-full"></div>
                Running Games ({runningGames.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {runningGames.map((game) => (
                  <SitAndGoCard
                    key={game.id}
                    game={game}
                    onJoin={joinGame}
                    onLeave={leaveGame}
                  />
                ))}
              </div>
            </div>
          )}

          {completedGames.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                Recently Completed ({completedGames.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedGames.slice(0, 6).map((game) => (
                  <SitAndGoCard
                    key={game.id}
                    game={game}
                    onJoin={joinGame}
                    onLeave={leaveGame}
                />
                ))}
              </div>
            </div>
          )}

          {filteredGames.length === 0 && (
            <div className="text-center py-12 bg-navy/50 rounded-lg border border-emerald/20">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Sit & Go Games Found
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Be the first to create a Sit & Go tournament!'
                }
              </p>
              {user && searchQuery === '' && statusFilter === 'ALL' && typeFilter === 'ALL' && (
                <CreateSitAndGoDialog onCreateGame={createGame} />
              )}
            </div>
          )}
        </div>
      </AppLayout>
    </div>
  );
}
