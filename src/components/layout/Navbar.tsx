
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Trophy, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User,
  Gamepad2,
  DollarSign,
  Calendar
} from 'lucide-react';
import { MobileNav } from './MobileNav';
import { NotificationButton } from './NotificationButton';
import { useTranslation } from '@/hooks/useTranslation';

export function Navbar() {
  const { user, session, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Close mobile nav when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
        setIsMobileNavOpen(false);
      }
    }

    if (isMobileNavOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileNavOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-navy/95 backdrop-blur-sm border-b border-emerald/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald rounded-full flex items-center justify-center">
              <span className="text-navy font-bold text-sm">P</span>
            </div>
            <span className="text-white font-bold text-xl">PokerPro</span>
          </Link>

          {/* Desktop Navigation */}
          {session && (
            <div className="hidden md:flex items-center space-x-1">
              <Button 
                variant={isActive('/lobby') ? 'default' : 'ghost'} 
                size="sm" 
                asChild
              >
                <Link to="/lobby" className="flex items-center">
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  {t('nav.lobby', 'Lobby')}
                </Link>
              </Button>
              
              <Button 
                variant={isActive('/tournaments') ? 'default' : 'ghost'} 
                size="sm" 
                asChild
              >
                <Link to="/tournaments" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('nav.tournaments', 'Tournaments')}
                </Link>
              </Button>
              
              <Button 
                variant={isActive('/leaderboards') ? 'default' : 'ghost'} 
                size="sm" 
                asChild
              >
                <Link to="/leaderboards" className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  {t('nav.leaderboards', 'Leaderboards')}
                </Link>
              </Button>
              
              <Button 
                variant={isActive('/funds') ? 'default' : 'ghost'} 
                size="sm" 
                asChild
              >
                <Link to="/funds" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {t('nav.funds', 'Funds')}
                </Link>
              </Button>
            </div>
          )}

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* Notification Button */}
                <NotificationButton />

                {/* Mobile Navigation Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                >
                  {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatarUrl} alt={user?.alias || user?.email} />
                        <AvatarFallback>
                          {(user?.alias || user?.email)?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user?.alias || 'Anonymous Player'}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('nav.profile', 'Profile')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t('nav.settings', 'Settings')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('auth.logout', 'Logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">{t('auth.login', 'Login')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">{t('auth.signup', 'Sign Up')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {session && isMobileNavOpen && (
        <div ref={mobileNavRef} className="md:hidden">
          <MobileNav setOpen={setIsMobileNavOpen} />
        </div>
      )}
    </nav>
  );
}
