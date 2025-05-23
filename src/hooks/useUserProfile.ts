import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';

export function useUserProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('alias, avatar_url, show_public_stats')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUser({
            ...user,
            alias: data.alias,
            avatarUrl: data.avatar_url,
            showInLeaderboard: data.show_public_stats
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, setUser]);

  return { loading, error };
}

