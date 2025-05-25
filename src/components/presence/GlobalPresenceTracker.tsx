
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { useUserPresence } from '@/hooks/useUserPresence';

export function GlobalPresenceTracker() {
  const { user } = useAuth();
  const { updatePresence } = useUserPresence();
  const location = useLocation();

  useEffect(() => {
    if (!user?.id) return;

    // Determinar el tipo de juego basado en la ruta actual
    let gameType: string | undefined;
    let tableId: string | undefined;

    if (location.pathname.startsWith('/game/') || location.pathname.startsWith('/table/')) {
      const pathSegments = location.pathname.split('/');
      tableId = pathSegments[2];
      gameType = 'Poker';
    } else if (location.pathname.startsWith('/tournaments/')) {
      gameType = 'Tournament';
    } else if (location.pathname === '/lobby') {
      gameType = 'Lobby';
    }

    // Actualizar presencia basada en la ubicación actual
    updatePresence(true, tableId, gameType);
  }, [location.pathname, user?.id, updatePresence]);

  return null;
}
