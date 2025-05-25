
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { NotificationButton } from './NotificationButton';
import { FriendsDropdown } from '@/components/friends/FriendsDropdown';
import { useAuth } from '@/stores/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Home, 
  Users, 
  Trophy, 
  Target, 
  Wallet,
  Settings,
  LogOut,
  User
} from 'lucide-react';

export function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: t('nav.home', 'Inicio'), icon: Home },
    { path: '/lobby', label: t('nav.lobby', 'Lobby'), icon: Users },
    { path: '/tournaments', label: t('nav.tournaments', 'Torneos'), icon: Trophy },
    { path: '/leaderboards', label: t('nav.leaderboards', 'Rankings'), icon: Target },
  ];

  if (!user) {
    return (
      <nav className="border-b border-emerald/20 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-emerald text-xl font-bold">
              PokerPro
            </Link>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button asChild variant="outline" size="sm">
                <Link to="/login">{t('auth.signIn', 'Iniciar Sesión')}</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">{t('auth.signUp', 'Registrarse')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-emerald/20 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-emerald text-xl font-bold">
            PokerPro
          </Link>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActivePath(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="text-white"
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/funds" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                {t('nav.funds', 'Fondos')}
              </Link>
            </Button>
            
            <FriendsDropdown />
            <NotificationButton />
            
            <Button asChild variant="ghost" size="sm">
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {user.alias || t('nav.profile', 'Perfil')}
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm">
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-red-400 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
            </Button>

            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}
