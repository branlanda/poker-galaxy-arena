
import { supabase } from '@/lib/supabase';

export const setupGameSubscription = (tableId: string, updateCallback: (gameState: any) => void) => {
  const channel = supabase.channel(`game:${tableId}`)
    .on('broadcast', { event: 'game_update' }, ({ payload }) => {
      updateCallback(payload);
    })
    .subscribe();
    
  return () => {
    channel.unsubscribe();
  };
};
