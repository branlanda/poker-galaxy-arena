
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, BarChart3 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function Navbar() {
  const { session, user, logout } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast()
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    navigate('/login');
  };

  return (
    <nav className="bg-navy/90 backdrop-blur-sm border-b border-emerald/20 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center font-bold text-xl text-white">
            <Avatar className="mr-2 w-8 h-8">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            EtherPoker
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-emerald transition-colors">
              {t('common.home', 'Inicio')}
            </Link>
            {session && (
              <Link
                to="/profile"
                className="text-gray-300 hover:text-emerald transition-colors flex items-center"
              >
                {t('common.profile', 'Perfil')}
              </Link>
            )}
            {session && (
              <Link
                to="/hand-history"
                className="text-gray-300 hover:text-emerald transition-colors flex items-center"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Historial
              </Link>
            )}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl} alt={user?.email} />
                      <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mr-2">
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Perfil</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/account')}>Cuenta</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin')}>Admin</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="bg-emerald text-navy rounded-md px-3 py-1 hover:bg-emerald-light transition-colors">
                {t('common.login', 'Login')}
              </Link>
            )}
            <Button
              variant="outline"
              size="icon"
              className="border-emerald/20 hover:bg-emerald/10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6 text-white" />
            </Button>
            {mobileMenuOpen && (
              <div className="absolute top-16 right-0 bg-navy rounded-md shadow-lg p-4 w-48 z-50 border border-emerald/20">
                <Link to="/" className="block text-gray-300 hover:text-emerald transition-colors py-2">
                  {t('common.home', 'Inicio')}
                </Link>
                {session && (
                  <Link
                    to="/profile"
                    className="block text-gray-300 hover:text-emerald transition-colors py-2"
                  >
                    {t('common.profile', 'Perfil')}
                  </Link>
                )}
                {session && (
                  <Link
                    to="/hand-history"
                    className="block text-gray-300 hover:text-emerald transition-colors py-2"
                  >
                    Historial
                  </Link>
                )}
                {session ? (
                  <>
                    <button onClick={handleSignOut} className="block text-gray-300 hover:text-emerald transition-colors py-2">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="block bg-emerald text-navy rounded-md px-3 py-1 hover:bg-emerald-light transition-colors">
                    {t('common.login', 'Login')}
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="border-emerald/20 hover:bg-emerald/10 mt-2"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
