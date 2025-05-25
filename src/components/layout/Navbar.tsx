
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/stores/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User, Settings, Moon, Sun, Trophy, Target, Users, Gamepad2, DollarSign } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-30 w-full backdrop-blur-sm border-b bg-navy/95 dark:bg-navy/95 shadow-sm border-emerald/20">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <MobileNav setOpen={setOpen} />
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-emerald" />
            <span className="font-bold text-xl text-emerald">Poker Galaxy</span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-emerald ${
              isActive('/') ? 'text-emerald' : 'text-gray-300 dark:text-gray-300'
            }`}
          >
            {t('common.welcome', 'Home')}
          </Link>
          <Link 
            to="/lobby" 
            className={`text-sm font-medium transition-colors hover:text-emerald flex items-center gap-1 ${
              isActive('/lobby') ? 'text-emerald' : 'text-gray-300 dark:text-gray-300'
            }`}
          >
            <Users className="h-4 w-4" />
            {t('lobby.title', 'Lobby')}
          </Link>
          <Link 
            to="/tournaments" 
            className={`text-sm font-medium transition-colors hover:text-emerald flex items-center gap-1 ${
              isActive('/tournaments') ? 'text-emerald' : 'text-gray-300 dark:text-gray-300'
            }`}
          >
            <Trophy className="h-4 w-4" />
            {t('tournaments.lobby', 'Tournaments')}
          </Link>
          <Link 
            to="/leaderboards" 
            className={`text-sm font-medium transition-colors hover:text-emerald flex items-center gap-1 ${
              isActive('/leaderboards') ? 'text-emerald' : 'text-gray-300 dark:text-gray-300'
            }`}
          >
            <Target className="h-4 w-4" />
            {t('leaderboards.title', 'Leaderboards')}
          </Link>
          {user && (
            <Link 
              to="/achievements" 
              className={`text-sm font-medium transition-colors hover:text-emerald flex items-center gap-1 ${
                isActive('/achievements') ? 'text-emerald' : 'text-gray-300 dark:text-gray-300'
              }`}
            >
              <Trophy className="h-4 w-4" />
              {t('achievements.title', 'Achievements')}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="mr-2 text-gray-300 hover:text-emerald hover:bg-emerald/10 transition-colors"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.avatarUrl}
                      alt={user.alias || "User"}
                    />
                    <AvatarFallback className="bg-emerald/20 text-emerald">
                      {(user.alias || "User")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-navy border-emerald/20" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {user.alias || "User"}
                    </p>
                    <p className="text-xs leading-none text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-emerald/20" />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="text-gray-300 hover:text-white">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("common.profile", "Profile")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/funds" className="text-gray-300 hover:text-white">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>{t("common.chips", "Funds")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/achievements" className="text-gray-300 hover:text-white">
                    <Trophy className="mr-2 h-4 w-4" />
                    <span>{t("achievements.title", "Achievements")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="text-gray-300 hover:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("common.settings", "Settings")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-emerald/20" />
                <DropdownMenuItem
                  className="cursor-pointer text-gray-300 hover:text-white"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("auth.signOut", "Sign Out")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">{t("auth.signIn", "Sign In")}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">{t("auth.signUp", "Sign Up")}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
