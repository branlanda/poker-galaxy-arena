
import { useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';

export const useUserPresence = (tableId?: string, gameType?: string) => {
  const { user } = useAuth();

  const updatePresence = async (isOnline: boolean, currentTableId?: string, currentGameType?: string) => {
    if (!user?.id) return;

    try {
      await supabase.rpc('update_user_presence', {
        p_is_online: isOnline,
        p_table_id: currentTableId || null,
        p_game_type: currentGameType || null
      });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  };

  // Actualizar presencia cuando cambie la mesa o juego
  useEffect(() => {
    if (user?.id) {
      updatePresence(true, tableId, gameType);
    }
  }, [user?.id, tableId, gameType]);

  // Marcar como online al montar el componente
  useEffect(() => {
    if (user?.id) {
      updatePresence(true);
    }

    // Marcar como offline al cerrar la ventana
    const handleBeforeUnload = () => {
      if (user?.id) {
        updatePresence(false);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (user?.id) {
        updatePresence(false);
      }
    };
  }, [user?.id]);

  return { updatePresence };
};
