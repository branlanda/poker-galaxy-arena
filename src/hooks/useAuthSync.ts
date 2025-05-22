
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';

export function useAuthSync() {
  const setUser = useAuth((s) => s.setUser);
  const setAdmin = useAuth((s) => s.setAdmin);
  
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
          .then(({ data: playerData, error }) => {
            if (playerData) {
              setUser({
                id: data.session.user.id,
                email: data.session.user.email,
                alias: playerData.alias,
                showInLeaderboard: playerData.show_public_stats
              });
              
              // Check if user is an admin
              checkIfAdmin(data.session.user.id);
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
            
            // Check if user is an admin
            checkIfAdmin(session.user.id);
          }
        } else {
          setUser(null);
          setAdmin(false);
        }
      }
    );

    // Function to check if user is admin
    async function checkIfAdmin(userId: string) {
      try {
        // For now, we'll set admin status manually
        // TODO: Replace with actual admin check from database
        // For development/demo purposes we'll set all users as admins
        // In production, you would check a user_roles table or similar
        setAdmin(true);
        
        // Example of how to properly check admin status with a user_roles table:
        // const { data } = await supabase
        //   .from('user_roles')
        //   .select('role')
        //   .eq('user_id', userId)
        //   .single();
        // 
        // setAdmin(data?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAdmin(false);
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setAdmin]);
}
