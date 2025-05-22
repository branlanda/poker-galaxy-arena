
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import Logo from '@/assets/Logo';
import { useAuth } from '@/stores/auth';
import { LanguageSelector } from '@/components/language/LanguageSelector';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-navy border-b border-emerald/10 py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo size="sm" />
          <span className="text-xl font-bold text-emerald ml-2">PokerP2P</span>
        </Link>
        
        <div className="flex gap-2 md:gap-4 items-center">
          <LanguageSelector />
          
          {user ? (
            <>
              <Link to="/funds">
                <Button variant="outline" size="sm">
                  Funds
                </Button>
              </Link>
              
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="primary" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
              
              <div className="text-emerald text-sm font-medium ml-2">
                {user.alias || user.email}
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
