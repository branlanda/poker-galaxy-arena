
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';

export const AdminGuard = ({ children }: { children: JSX.Element }) => {
  const user = useAuth((s) => s.user);
  const isAdmin = useAuth((s) => s.isAdmin);
  
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  
  return children;
};
