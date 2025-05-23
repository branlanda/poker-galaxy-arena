
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export const AdminGuard = ({ children }: { children: JSX.Element }) => {
  const { user, isAdmin, setAdmin } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Check if the user has an admin role in the players table
        const { data, error } = await supabase
          .from('players')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        // Set admin status based on role
        const hasAdminRole = data?.role === 'ADMIN';
        setAdmin(hasAdminRole);
        
        if (!hasAdminRole) {
          toast({
            title: "Access Denied",
            description: "You do not have permission to access the admin panel",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminRole();
  }, [user, toast, setAdmin]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="w-8 h-8 border-4 border-t-emerald rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  
  return children;
};
