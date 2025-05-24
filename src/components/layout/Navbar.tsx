
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/Button";
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
import { Menu, LogOut, User, Settings, Moon, Sun, Trophy, Target } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-30 w-full backdrop-blur-sm border-b bg-navy/80 shadow-sm border-emerald/20">
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
            <span className="font-bold text-xl text-emerald">Poker Galaxy</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-emerald ${
              isActive('/') ? 'text-emerald' : 'text-gray-300'
            }`}
          >
            {t('home', 'Home')}
          </Link>
          <Link 
            to="/lobby" 
            className={`text-sm font-medium transition-colors hover:text-emerald ${
              isActive('/lobby') ? 'text-emerald' : 'text-gray-300'
            }`}
          >
            {t('lobby', 'Lobby')}
          </Link>
          <Link 
            to="/tournaments" 
            className={`text-sm font-medium transition-colors hover:text-emerald ${
              isActive('/tournaments') ? 'text-emerald' : 'text-gray-300'
            }`}
          >
            {t('tournaments', 'Tournaments')}
          </Link>
          <Link 
            to="/leaderboards" 
            className={`text-sm font-medium transition-colors hover:text-emerald ${
              isActive('/leaderboards') ? 'text-emerald' : 'text-gray-300'
            }`}
          >
            {t('leaderboards', 'Leaderboards')}
          </Link>
          {user && (
            <Link 
              to="/achievements" 
              className={`text-sm font-medium transition-colors hover:text-emerald ${
                isActive('/achievements') ? 'text-emerald' : 'text-gray-300'
              }`}
            >
              <Trophy className="h-4 w-4 inline mr-1" />
              {t('achievements', 'Achievements')}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            className="mr-2"
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
                    <AvatarFallback>
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
                    <span>{t("profile")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/funds" className="text-gray-300 hover:text-white">
                    <Target className="mr-2 h-4 w-4" />
                    <span>{t("funds", "Funds")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="text-gray-300 hover:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("settings")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-emerald/20" />
                <DropdownMenuItem
                  className="cursor-pointer text-gray-300 hover:text-white"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("signOut")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => window.location.href = '/login'}>
              {t("signIn")}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
