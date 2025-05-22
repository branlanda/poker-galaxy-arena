
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import Logo from '@/assets/Logo';
import { useAuth } from '@/stores/auth';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || 'P2';
  };

  return (
    <nav className="bg-navy border-b border-emerald/10 py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center">
            <Logo size="sm" />
            <span className="text-xl font-bold text-emerald ml-2">PokerP2P</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/lobby" className="text-gray-300 hover:text-emerald">
              Lobby
            </Link>
            {user && (
              <>
                <Link to="/funds" className="text-gray-300 hover:text-emerald">
                  Funds
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-emerald hover:text-emerald-400">
                Admin
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 md:gap-4 items-center">
          <LanguageSelector />
          
          {user ? (
            <>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-navy focus:bg-navy">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-emerald/20">
                          {user.avatarUrl ? (
                            <AvatarImage src={user.avatarUrl} alt={user.alias || 'User'} />
                          ) : (
                            <AvatarFallback className="bg-navy/50 text-emerald">
                              {getInitials(user.alias || user.email || '')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-emerald text-sm font-medium hidden md:inline">
                          {user.alias || user.email}
                        </span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-navy border border-emerald/10 p-2 min-w-[160px]">
                      <div className="flex flex-col gap-1">
                        <Link to="/profile" className="text-sm text-gray-300 hover:text-emerald px-3 py-2 rounded hover:bg-navy/60">
                          My Profile
                        </Link>
                        <Link to="/funds" className="text-sm text-gray-300 hover:text-emerald px-3 py-2 rounded hover:bg-navy/60">
                          Funds
                        </Link>
                        <Link to="/lobby" className="text-sm text-gray-300 hover:text-emerald px-3 py-2 rounded hover:bg-navy/60 md:hidden">
                          Lobby
                        </Link>
                        <Link to="/settings" className="text-sm text-gray-300 hover:text-emerald px-3 py-2 rounded hover:bg-navy/60">
                          Settings
                        </Link>
                        <hr className="border-emerald/10 my-1" />
                        {isAdmin && (
                          <Link to="/admin" className="text-sm text-emerald px-3 py-2 rounded hover:bg-navy/60 md:hidden">
                            Admin
                          </Link>
                        )}
                        <button 
                          onClick={handleLogout} 
                          className="text-sm text-red-400 hover:text-red-300 text-left px-3 py-2 rounded hover:bg-navy/60"
                        >
                          Sign Out
                        </button>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
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
