
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';

export function useAuthSync() {
  const setUser = useAuth((s) => s.setUser);
  const setSession = useAuth((s) => s.setSession);
  const setAdmin = useAuth((s) => s.setAdmin);
  
  useEffect(() => {
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only synchronous state updates here
        setSession(session);
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email
          });
          
          // Defer Supabase calls with setTimeout to prevent deadlocks
          setTimeout(async () => {
            try {
              // Fetch player data
              const { data: playerData } = await supabase.from('players')
                .select('alias, show_public_stats')
                .eq('user_id', session.user.id)
                .single();
                
              // Fetch profile data
              const { data: profileData } = await supabase.from('profiles')
                .select('avatar_url')
                .eq('id', session.user.id)
                .single();
                
              if (playerData || profileData) {
                setUser({
                  id: session.user.id,
                  email: session.user.email,
                  alias: playerData?.alias,
                  showInLeaderboard: playerData?.show_public_stats,
                  avatarUrl: profileData?.avatar_url
                });
                
                // Check if user is admin
                checkIfAdmin(session.user.id);
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          }, 0);
        } else {
          setUser(null);
          setAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email
        });
        
        // Fetch player and profile data
        Promise.all([
          supabase.from('players')
            .select('alias, show_public_stats')
            .eq('user_id', data.session.user.id)
            .single(),
          supabase.from('profiles')
            .select('avatar_url')
            .eq('id', data.session.user.id)
            .single()
        ]).then(([playerResult, profileResult]) => {
          const playerData = playerResult.data;
          const profileData = profileResult.data;
          
          if (playerData || profileData) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email,
              alias: playerData?.alias,
              showInLeaderboard: playerData?.show_public_stats,
              avatarUrl: profileData?.avatar_url
            });
            
            // Check if user is admin
            checkIfAdmin(data.session.user.id);
          }
        }).catch(error => {
          console.error('Error fetching user data:', error);
        });
      }
    });

    // Function to check if user is admin
    async function checkIfAdmin(userId: string) {
      try {
        const { data } = await supabase
          .from('players')
          .select('role')
          .eq('user_id', userId)
          .single();
        
        setAdmin(data?.role === 'ADMIN');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAdmin(false);
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setAdmin]);
}
