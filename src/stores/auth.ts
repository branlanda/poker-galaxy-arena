
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

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
  setUser: (u) => set({ user: u }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  }
}));
