
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { Logo } from '@/assets/Logo';
import { useAuth } from '@/stores/auth';
import { useBalance } from '@/hooks/useBalance';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, LogOut, User, Settings, Trophy, Medal, Award } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function Navbar() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { balance } = useBalance();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSignOut = () => {
    signOut();
  };

  const getInitials = (email: string) => {
    if (email.includes('@')) {
      return email.split('@')[0].substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2">
            <Logo className="h-6 w-auto" />
          </NavLink>
          
          {!isMobile && (
            <nav className="flex gap-4">
              <NavLink
                to="/lobby"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-emerald ${
                    isActive ? "text-emerald" : "text-muted-foreground"
                  }`
                }
              >
                {t('lobby', 'Lobby')}
              </NavLink>
              <NavLink
                to="/tournaments"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-emerald ${
                    isActive ? "text-emerald" : "text-muted-foreground"
                  }`
                }
              >
                {t('tournaments.lobby', 'Tournaments')}
              </NavLink>
              <NavLink
                to="/leaderboards"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-emerald ${
                    isActive ? "text-emerald" : "text-muted-foreground"
                  }`
                }
              >
                {t('leaderboards.title', 'Leaderboards')}
              </NavLink>
              <NavLink
                to="/achievements"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-emerald ${
                    isActive ? "text-emerald" : "text-muted-foreground"
                  }`
                }
              >
                {t('achievements.title', 'Achievements')}
              </NavLink>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isMobile && <LanguageSelector />}

          {user ? (
            <>
              {!isMobile && (
                <NavLink
                  to="/funds"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-emerald transition-colors"
                >
                  <span className="font-bold text-emerald">{balance}</span>
                </NavLink>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {getInitials(user.email || "")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile" className="flex cursor-pointer items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('profile', 'Profile')}</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/funds" className="flex cursor-pointer items-center">
                      <span className="mr-2 font-bold text-emerald">{balance}</span>
                      <span>{t('funds', 'Funds')}</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/achievements" className="flex cursor-pointer items-center">
                      <Medal className="mr-2 h-4 w-4" />
                      <span>{t('achievements.title', 'Achievements')}</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/leaderboards" className="flex cursor-pointer items-center">
                      <Trophy className="mr-2 h-4 w-4" />
                      <span>{t('leaderboards.title', 'Leaderboards')}</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/settings" className="flex cursor-pointer items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('settings', 'Settings')}</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('signOut', 'Sign out')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {!isMobile && (
                <NavLink to="/login">
                  <Button variant="ghost">{t('signIn', 'Sign in')}</Button>
                </NavLink>
              )}
              <NavLink to="/signup">
                <Button>{t('signUp', 'Sign up')}</Button>
              </NavLink>
            </div>
          )}

          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  <NavLink
                    to="/lobby"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-emerald ${
                        isActive ? "text-emerald" : "text-muted-foreground"
                      }`
                    }
                  >
                    {t('lobby', 'Lobby')}
                  </NavLink>
                  <NavLink
                    to="/tournaments"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-emerald ${
                        isActive ? "text-emerald" : "text-muted-foreground"
                      }`
                    }
                  >
                    {t('tournaments.lobby', 'Tournaments')}
                  </NavLink>
                  <NavLink
                    to="/leaderboards"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-emerald ${
                        isActive ? "text-emerald" : "text-muted-foreground"
                      }`
                    }
                  >
                    {t('leaderboards.title', 'Leaderboards')}
                  </NavLink>
                  <NavLink
                    to="/achievements"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-emerald ${
                        isActive ? "text-emerald" : "text-muted-foreground"
                      }`
                    }
                  >
                    {t('achievements.title', 'Achievements')}
                  </NavLink>
                  
                  <div className="h-px bg-border my-2" />
                  
                  {user ? (
                    <>
                      <NavLink
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-muted-foreground hover:text-emerald transition-colors"
                      >
                        {t('profile', 'Profile')}
                      </NavLink>
                      <NavLink
                        to="/funds"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-emerald transition-colors"
                      >
                        <span>{t('funds', 'Funds')}: </span>
                        <span className="font-bold text-emerald">{balance}</span>
                      </NavLink>
                      <NavLink
                        to="/settings"
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-muted-foreground hover:text-emerald transition-colors"
                      >
                        {t('settings', 'Settings')}
                      </NavLink>
                      <Button variant="ghost" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('signOut', 'Sign out')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <NavLink to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost">{t('signIn', 'Sign in')}</Button>
                      </NavLink>
                      <NavLink to="/signup" onClick={() => setIsOpen(false)}>
                        <Button>{t('signUp', 'Sign up')}</Button>
                      </NavLink>
                    </>
                  )}
                  
                  <div className="mt-4">
                    <LanguageSelector />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
