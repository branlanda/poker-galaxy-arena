
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGameRoom } from '@/hooks/useGameRoom';
import { GameRoomLoader } from '@/components/poker/GameRoomLoader';
import { GameRoomError } from '@/components/poker/GameRoomError';
import { TableManager } from '@/components/poker/TableManager';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/stores/auth';

export default function GameRoom() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    table,
    loading,
    gameError
  } = useGameRoom(tableId);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      toast({
        title: "Autenticación Requerida",
        description: "Necesitas iniciar sesión para acceder a la sala de juego",
        variant: "destructive",
      });
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state
  if (loading) {
    return <GameRoomLoader />;
  }

  // Show error state if there's an issue
  if (gameError || !table) {
    const errorMessage = gameError || 'Mesa no encontrada o no tienes permisos para acceder';
    return <GameRoomError error={errorMessage} onBack={() => navigate('/lobby')} />;
  }

  // Redirect if table closed
  useEffect(() => {
    if (!loading && table?.status === 'CLOSED') {
      toast({
        title: "Mesa Cerrada",
        description: "Esta mesa ha sido cerrada",
        variant: "destructive",
      });
      navigate('/lobby');
    }
  }, [table, loading, navigate]);

  const handleTableChange = (newTableId: string) => {
    if (newTableId !== tableId) {
      navigate(`/game/${newTableId}`, { replace: true });
    }
  };

  const handleTableClose = (closedTableId: string) => {
    if (closedTableId === tableId) {
      navigate('/lobby', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <TableManager
        currentTableId={tableId}
        onTableChange={handleTableChange}
        onTableClose={handleTableClose}
      />
    </div>
  );
}
