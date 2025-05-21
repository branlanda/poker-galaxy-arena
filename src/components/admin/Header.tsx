
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/Button';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-navy border-b border-emerald/10 py-3 px-6 flex items-center justify-between">
      <h1 className="text-lg font-medium">Admin Dashboard</h1>
      
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-emerald">
              {user.alias || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
