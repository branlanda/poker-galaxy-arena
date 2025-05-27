import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-navy/90 backdrop-blur-sm border-b border-emerald/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold text-emerald">PokerPro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/lobby" 
              className="text-gray-300 hover:text-emerald transition-colors duration-200"
            >
              Cash Games
            </Link>
            <Link 
              to="/tournaments" 
              className="text-gray-300 hover:text-emerald transition-colors duration-200"
            >
              Tournaments
            </Link>
            <Link 
              to="/sit-and-go" 
              className="text-gray-300 hover:text-emerald transition-colors duration-200"
            >
              Sit & Go
            </Link>
            <Link 
              to="/leaderboards" 
              className="text-gray-300 hover:text-emerald transition-colors duration-200"
            >
              Leaderboards
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url} alt={user.username} />
                  <AvatarFallback className="bg-emerald/20 text-emerald">
                    {user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="secondary" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <Menu className="h-6 w-6 text-gray-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-navy/90 backdrop-blur-sm border-b border-emerald/20">
                <SheetHeader className="text-left">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through the app.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Link to="/lobby" className="block text-gray-300 hover:text-emerald transition-colors duration-200 p-2">
                    Cash Games
                  </Link>
                  <Link to="/tournaments" className="block text-gray-300 hover:text-emerald transition-colors duration-200 p-2">
                    Tournaments
                  </Link>
                   <Link 
                    to="/sit-and-go" 
                    className="text-gray-300 hover:text-emerald transition-colors duration-200"
                  >
                    Sit & Go
                  </Link>
                  <Link to="/leaderboards" className="block text-gray-300 hover:text-emerald transition-colors duration-200 p-2">
                    Leaderboards
                  </Link>
                  {user ? (
                    <Button variant="secondary" size="sm" onClick={() => { signOut(); setMobileMenuOpen(false); }} className="w-full">
                      Sign Out
                    </Button>
                  ) : (
                    <Link to="/login" className="block">
                      <Button variant="secondary" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      
    </nav>
  );
};

export default Navbar;
