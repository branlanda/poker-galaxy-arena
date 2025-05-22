
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { RefreshCcw } from 'lucide-react';
import { CreateTableDialog } from '@/components/lobby/CreateTableDialog';
import { useAuth } from '@/stores/auth';

interface LobbyHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

export function LobbyHeader({ onRefresh, loading }: LobbyHeaderProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald">{t('pokerTablesLobby', 'Poker Tables Lobby')}</h1>
        <p className="text-gray-400 mt-1">{t('lobbyDescription', 'Join an existing table or create your own')}</p>
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
          {t('refresh', 'Refresh')}
        </Button>
        
        {user ? (
          <CreateTableDialog />
        ) : (
          <Button onClick={() => window.location.href = '/login'}>
            {t('logInToCreateTables', 'Log In to Create Tables')}
          </Button>
        )}
      </div>
    </div>
  );
}
