
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const AdminGuard = ({ children }: { children: JSX.Element }) => {
  const user = useAuth((s) => s.user);
  const isAdmin = useAuth((s) => s.isAdmin);
  const { toast } = useToast();
  
  useEffect(() => {
    // Only show this message if the user is logged in but not an admin
    if (user && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin panel",
        variant: "destructive",
      });
    }
  }, [user, isAdmin, toast]);
  
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  
  return children;
};
