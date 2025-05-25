
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email?: string;
  alias?: string;
  showInLeaderboard?: boolean;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  session: any | null;
  setUser: (u: User | null) => void;
  setSession: (s: any | null) => void;
  setAdmin: (is: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, alias: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isAdmin: false,
  session: null,
  setUser: (u) => {
    set({ user: u });
    if (u) {
      localStorage.setItem('user', JSON.stringify(u));
    } else {
      localStorage.removeItem('user');
    }
  },
  setSession: (s) => {
    set({ session: s });
  },
  setAdmin: (is) => {
    set({ isAdmin: is });
  },
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        alias: profile?.alias,
        avatarUrl: profile?.avatar_url,
        showInLeaderboard: profile?.show_public_stats,
      };

      set({ user, session: data.session });
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  signUp: async (email: string, password: string, alias: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          alias: alias,
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      // Create profile
      await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          alias: alias,
        });

      // Create player record
      await supabase
        .from('players')
        .insert({
          user_id: data.user.id,
          alias: alias,
        });

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        alias: alias,
      };

      set({ user, session: data.session });
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  updateUserProfile: async (data) => {
    const { user } = get();
    if (!user?.id) return;

    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          alias: data.alias,
          avatar_url: data.avatarUrl,
          show_public_stats: data.showInLeaderboard
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update player record if needed
      if (data.alias) {
        await supabase
          .from('players')
          .update({ alias: data.alias })
          .eq('user_id', user.id);
      }

      // Update local state
      set({
        user: { ...user, ...data }
      });
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    set({ user: null, isAdmin: false, session: null });
  }
}));
