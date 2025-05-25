
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Home, Trophy, Target, Users } from 'lucide-react';
import { CreateTableDialog } from '@/components/lobby/CreateTableDialog';
import { useAuth } from '@/stores/auth';
import { Link } from 'react-router-dom';

interface LobbyHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

export function LobbyHeader({ onRefresh, loading }: LobbyHeaderProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link to="/" className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              {t('common.home', 'Home')}
            </Link>
          </Button>
          <div className="h-6 w-px bg-gray-600"></div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Link to="/tournaments" className="flex items-center text-gray-300 hover:text-emerald">
                <Trophy className="h-4 w-4 mr-2" />
                {t('tournaments.lobby', 'Tournaments')}
              </Link>
            </Button>
            <Button variant="ghost" size="sm">
              <Link to="/leaderboards" className="flex items-center text-gray-300 hover:text-emerald">
                <Target className="h-4 w-4 mr-2" />
                {t('leaderboards.title', 'Leaderboards')}
              </Link>
            </Button>
            {user && (
              <Button variant="ghost" size="sm">
                <Link to="/achievements" className="flex items-center text-gray-300 hover:text-emerald">
                  <Trophy className="h-4 w-4 mr-2" />
                  {t('achievements.title', 'Achievements')}
                </Link>
              </Button>
            )}
          </nav>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={loading}
            className="hidden sm:flex"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('common.refresh', 'Refresh')}
          </Button>
          
          {user ? (
            <CreateTableDialog />
          ) : (
            <Button onClick={() => window.location.href = '/login'}>
              {t('auth.login', 'Log In to Create Tables')}
            </Button>
          )}
        </div>
      </div>

      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-emerald mb-2">
          {t('lobby.title', 'Poker Tables Lobby')}
        </h1>
        <p className="text-gray-400">
          {t('lobby.joinTable', 'Join an existing table or create your own')}
        </p>
      </div>
    </div>
  );
}
