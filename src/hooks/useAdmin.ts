import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  role: 'superadmin' | 'moderator' | 'support';
  created_at?: string;
}

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setAdminRole(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setIsAdmin(true);
          setAdminRole(data.role);
        } else {
          setIsAdmin(false);
          setAdminRole(null);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin access');
        setIsAdmin(false);
        setAdminRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const createAuditLog = async (action: string, description: string, metadata: any = {}) => {
    if (!user || !isAdmin) return;

    try {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action,
        description,
        metadata
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
    }
  };

  const canPerformAction = (requiredRole: 'superadmin' | 'moderator' | 'support') => {
    if (!isAdmin) return false;
    
    // Superadmins can do everything
    if (adminRole === 'superadmin') return true;
    
    // Moderators can do their own actions plus support actions
    if (adminRole === 'moderator' && requiredRole === 'support') return true;
    
    // Otherwise, role must match exactly
    return adminRole === requiredRole;
  };

  return { 
    isAdmin, 
    adminRole, 
    loading, 
    error,
    createAuditLog,
    canPerformAction
  };
}
