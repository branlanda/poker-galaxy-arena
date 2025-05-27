
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/assets/Logo';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FriendsDropdown } from '@/components/friends/FriendsDropdown';
import { Menu, User, Settings, LogOut, DollarSign } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-navy/90 backdrop-blur-sm border-b border-emerald/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Logo size="sm" />
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
                <FriendsDropdown />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.alias} />
                        <AvatarFallback className="bg-emerald/20 text-emerald">
                          {user.alias?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.alias || user.email}</p>
                        {user.alias && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/funds">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>Funds</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => logout()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    <Button variant="secondary" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full">
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
    </nav>
  );
};

export default Navbar;
