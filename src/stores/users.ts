
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  alias: string;
  email: string;
  country: string;
  balance: number;
  kyc: 0 | 1 | 2 | 3;
  banned: boolean;
  registeredAt: Date;
  lastLoginAt?: Date;
  ipAddress?: string;
  status?: string;
}

interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  filters: {
    searchTerm?: string;
    country?: string;
    kyc?: 0 | 1 | 2 | 3;
    banned?: boolean;
    status?: string;
  };
  userStats: {
    total: number;
    active: number;
    banned: number;
    kycPending: number;
  };
  setUsers: (users: User[]) => void;
  setSelectedUser: (user: User | null) => void;
  setFilters: (filters: Partial<UsersState['filters']>) => void;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  banUser: (id: string) => Promise<void>;
  unbanUser: (id: string) => Promise<void>;
  approveKyc: (id: string) => Promise<void>;
  resetUserFunds: (id: string) => Promise<void>;
  updateUserStatus: (id: string, status: string) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  filters: {},
  userStats: {
    total: 0,
    active: 0,
    banned: 0,
    kycPending: 0,
  },
  
  setUsers: (users) => set({ users }),
  
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  fetchUsers: async () => {
    try {
      set({ isLoading: true });
      
      // In a real application, this would be an API call to fetch users from Supabase
      // For now, we're using mock data already in the store
      
      // Update stats based on user data
      const { users } = get();
      set({
        userStats: {
          total: users.length,
          active: users.filter(u => !u.banned).length,
          banned: users.filter(u => u.banned).length,
          kycPending: users.filter(u => u.kyc < 2).length,
        }
      });
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchUserById: async (id) => {
    try {
      set({ isLoading: true });
      
      // In a real app, we would fetch the user from Supabase
      const { users } = get();
      const user = users.find(u => u.id === id) || null;
      set({ selectedUser: user });
      
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user details. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  banUser: async (id) => {
    try {
      // In a real app, we would call Supabase to update the user status
      // await supabase.from('profiles').update({ banned: true }).eq('id', id);
      
      // Log the action in audit logs
      await supabase.from('audit_logs').insert({
        user_id: 'admin-user', // In real app, this would be the current admin user ID
        action: 'BAN_USER',
        description: `User ${id} banned`,
        metadata: { userId: id }
      });
      
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, banned: true } : user
        ),
        selectedUser: state.selectedUser?.id === id 
          ? { ...state.selectedUser, banned: true } 
          : state.selectedUser
      }));
      
      toast({
        title: 'User Banned',
        description: 'The user has been banned successfully.',
      });
      
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: 'Action Failed',
        description: 'Failed to ban user. Please try again.',
        variant: 'destructive',
      });
    }
  },
  
  unbanUser: async (id) => {
    try {
      // In a real app, update user status in Supabase
      // await supabase.from('profiles').update({ banned: false }).eq('id', id);
      
      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: 'admin-user',
        action: 'UNBAN_USER',
        description: `User ${id} unbanned`,
        metadata: { userId: id }
      });
      
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, banned: false } : user
        ),
        selectedUser: state.selectedUser?.id === id 
          ? { ...state.selectedUser, banned: false } 
          : state.selectedUser
      }));
      
      toast({
        title: 'User Unbanned',
        description: 'The user has been unbanned successfully.',
      });
      
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast({
        title: 'Action Failed',
        description: 'Failed to unban user. Please try again.',
        variant: 'destructive',
      });
    }
  },
  
  approveKyc: async (id) => {
    try {
      const { users, selectedUser } = get();
      const user = users.find(u => u.id === id) || selectedUser;
      
      if (!user) throw new Error('User not found');
      
      const newKycLevel = Math.min(user.kyc + 1, 3) as 0 | 1 | 2 | 3;
      
      // In a real app, update KYC level in Supabase
      // await supabase.from('profiles').update({ kyc_level: newKycLevel }).eq('id', id);
      
      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: 'admin-user',
        action: 'APPROVE_KYC',
        description: `KYC Level increased to ${newKycLevel} for user ${id}`,
        metadata: { userId: id, newLevel: newKycLevel }
      });
      
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, kyc: newKycLevel } : user
        ),
        selectedUser: state.selectedUser?.id === id 
          ? { ...state.selectedUser, kyc: newKycLevel } 
          : state.selectedUser
      }));
      
      toast({
        title: 'KYC Approved',
        description: `User KYC level increased to ${newKycLevel}.`,
      });
      
    } catch (error) {
      console.error('Error approving KYC:', error);
      toast({
        title: 'Action Failed',
        description: 'Failed to approve KYC. Please try again.',
        variant: 'destructive',
      });
    }
  },
  
  resetUserFunds: async (id) => {
    try {
      // In a real app, we would reset user funds in Supabase
      // This would involve multiple operations with the ledger
      
      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: 'admin-user',
        action: 'RESET_FUNDS',
        description: `Funds reset for user ${id}`,
        metadata: { userId: id }
      });
      
      toast({
        title: 'Funds Reset',
        description: 'The user funds have been reset successfully.',
      });
      
    } catch (error) {
      console.error('Error resetting funds:', error);
      toast({
        title: 'Action Failed',
        description: 'Failed to reset user funds. Please try again.',
        variant: 'destructive',
      });
    }
  },
  
  updateUserStatus: async (id, status) => {
    try {
      // In a real app, update user status in Supabase
      // await supabase.from('profiles').update({ status }).eq('id', id);
      
      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: 'admin-user',
        action: 'UPDATE_USER_STATUS',
        description: `Status updated to ${status} for user ${id}`,
        metadata: { userId: id, status }
      });
      
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, status } : user
        ),
        selectedUser: state.selectedUser?.id === id 
          ? { ...state.selectedUser, status } 
          : state.selectedUser
      }));
      
      toast({
        title: 'Status Updated',
        description: `User status has been updated to ${status}.`,
      });
      
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Action Failed',
        description: 'Failed to update user status. Please try again.',
        variant: 'destructive',
      });
    }
  }
}));
