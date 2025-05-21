
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Logo from '@/assets/Logo';
import { Button } from '@/components/ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-navy/90 border-b border-emerald/20">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white hover:text-emerald"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/lobby" className="text-white hover:text-emerald transition-colors">
            Lobby
          </Link>
          <Link to="/tournament" className="text-white hover:text-emerald transition-colors">
            Tournaments
          </Link>
          <Link to="/funds" className="text-white hover:text-emerald transition-colors">
            Funds
          </Link>
          <Link to="/vip" className="text-white hover:text-emerald transition-colors">
            VIP
          </Link>
          <Link to="/affiliate" className="text-white hover:text-emerald transition-colors">
            Affiliate
          </Link>
          <Link to="/hof" className="text-white hover:text-emerald transition-colors">
            Hall of Fame
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <Button variant="primary" size="sm">
            Sign Up
          </Button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-navy border-b border-emerald/20 md:hidden z-50">
            <div className="flex flex-col p-4">
              <Link 
                to="/lobby" 
                className="py-2 text-white hover:text-emerald transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Lobby
              </Link>
              <Link 
                to="/tournament" 
                className="py-2 text-white hover:text-emerald transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tournaments
              </Link>
              <Link 
                to="/funds" 
                className="py-2 text-white hover:text-emerald transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Funds
              </Link>
              <Link 
                to="/vip" 
                className="py-2 text-white hover:text-emerald transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                VIP
              </Link>
              <Link 
                to="/affiliate" 
                className="py-2 text-white hover:text-emerald transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Affiliate
              </Link>
              <Link 
                to="/hof" 
                className="py-2 text-white hover:text-emerald transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Hall of Fame
              </Link>
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-emerald/10">
                <Button variant="outline" fullWidth>
                  Sign In
                </Button>
                <Button variant="primary" fullWidth>
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
