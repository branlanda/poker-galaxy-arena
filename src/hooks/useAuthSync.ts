
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export function useAuthSync() {
  const setUser = useAuth((s) => s.setUser);
  const setSession = useAuth((s) => s.setSession);
  const setAdmin = useAuth((s) => s.setAdmin);
  
  useEffect(() => {
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Only synchronous state updates here
        setSession(session);
        
        if (session?.user) {
          // Check if user email is verified for security
          if (!session.user.email_confirmed_at && event === 'SIGNED_IN') {
            console.warn('User logged in with unverified email');
            // In production, you might want to force sign out here
          }

          // Initial minimal user update
          const minimalUser = {
            id: session.user.id,
            email: session.user.email
          };
          setUser(minimalUser);
          
          // Defer Supabase calls with setTimeout to prevent deadlocks
          setTimeout(async () => {
            try {
              // Parallel fetching of player and profile data
              const [playerResponse, profileResponse] = await Promise.all([
                supabase.from('players')
                  .select('alias, show_public_stats, role')
                  .eq('user_id', session.user.id)
                  .maybeSingle(),
                supabase.from('profiles')
                  .select('avatar_url')
                  .eq('id', session.user.id)
                  .maybeSingle()
              ]);

              const playerData = playerResponse.data;
              const profileData = profileResponse.data;
              
              if (playerData || profileData) {
                // Update user with extended information
                setUser({
                  id: session.user.id,
                  email: session.user.email,
                  alias: playerData?.alias,
                  showInLeaderboard: playerData?.show_public_stats,
                  avatarUrl: profileData?.avatar_url
                });
                
                // Set admin status
                setAdmin(playerData?.role === 'ADMIN');
              }

              // Log successful authentication for security monitoring
              if (event === 'SIGNED_IN') {
                await supabase.from('audit_logs').insert({
                  user_id: session.user.id,
                  action: 'USER_LOGIN',
                  description: 'User logged in successfully',
                  metadata: { 
                    email: session.user.email,
                    timestamp: new Date().toISOString(),
                    user_agent: navigator.userAgent
                  }
                });
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          }, 0);
        } else {
          // Clear user data on sign out
          setUser(null);
          setAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (!session?.user) {
        setUser(null);
        return;
      }

      // Set basic user data immediately
      setUser({
        id: session.user.id,
        email: session.user.email
      });
      
      // Fetch extended user data
      Promise.all([
        supabase.from('players')
          .select('alias, show_public_stats, role')
          .eq('user_id', session.user.id)
          .maybeSingle(),
        supabase.from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .maybeSingle()
      ])
      .then(([playerResponse, profileResponse]) => {
        const playerData = playerResponse.data;
        const profileData = profileResponse.data;
        
        if (playerData || profileData) {
          // Update with extended info
          setUser({
            id: session.user.id,
            email: session.user.email,
            alias: playerData?.alias,
            showInLeaderboard: playerData?.show_public_stats,
            avatarUrl: profileData?.avatar_url
          });
          
          // Set admin status
          setAdmin(playerData?.role === 'ADMIN');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setAdmin]);
}
