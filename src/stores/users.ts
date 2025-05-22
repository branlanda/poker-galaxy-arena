
import { create } from 'zustand';

export interface User {
  id: string;
  alias: string;
  email: string;
  country: string;
  balance: number;
  kyc: 0 | 1 | 2 | 3;
  banned: boolean;
  registeredAt: Date;
}

interface UsersState {
  users: User[];
  filters: {
    searchTerm?: string;
    country?: string;
    kyc?: 0 | 1 | 2 | 3;
    banned?: boolean;
  };
  setUsers: (users: User[]) => void;
  setFilters: (filters: Partial<UsersState['filters']>) => void;
  banUser: (id: string) => void;
  unbanUser: (id: string) => void;
  approveKyc: (id: string) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  filters: {},
  
  setUsers: (users) => set({ users }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  banUser: (id) => set((state) => ({
    users: state.users.map(user => 
      user.id === id ? { ...user, banned: true } : user
    )
  })),
  
  unbanUser: (id) => set((state) => ({
    users: state.users.map(user => 
      user.id === id ? { ...user, banned: false } : user
    )
  })),
  
  approveKyc: (id) => set((state) => ({
    users: state.users.map(user => 
      user.id === id ? { ...user, kyc: Math.min(user.kyc + 1, 3) as 0 | 1 | 2 | 3 } : user
    )
  })),
}));
