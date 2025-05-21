
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';

export function useAuthSync() {
  const setUser = useAuth((s) => s.setUser);
  
  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email
        });
        
        // Fetch player data
        supabase.from('players')
          .select('alias, show_public_stats')
          .eq('user_id', data.session.user.id)
          .single()
          .then(({ data: playerData }) => {
            if (playerData) {
              setUser({
                id: data.session.user.id,
                email: data.session.user.email,
                alias: playerData.alias,
                showInLeaderboard: playerData.show_public_stats
              });
            }
          });
      } else {
        setUser(null);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email
          });
          
          // Fetch player data
          const { data: playerData } = await supabase.from('players')
            .select('alias, show_public_stats')
            .eq('user_id', session.user.id)
            .single();
            
          if (playerData) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              alias: playerData.alias,
              showInLeaderboard: playerData.show_public_stats
            });
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);
}
