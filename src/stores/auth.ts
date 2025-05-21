
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email?: string;
  alias?: string;
  showInLeaderboard?: boolean;
}

interface AuthState {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (u) => {
    set({ user: u });
    if (u) {
      localStorage.setItem('user', JSON.stringify(u));
    } else {
      localStorage.removeItem('user');
    }
  },
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    set({ user: null });
  }
}));
