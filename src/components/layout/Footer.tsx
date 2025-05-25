
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, MessageCircle } from 'lucide-react';
import Logo from '@/assets/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy/90 border-t border-emerald/10 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-gray-300 text-sm">
              The premier destination for peer-to-peer online poker. Fair games, fast payouts, and a vibrant community.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-emerald hover:text-emerald/80 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-emerald hover:text-emerald/80 transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-emerald hover:text-emerald/80 transition-colors">
                <span className="sr-only">Discord</span>
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-gold font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/lobby" className="text-gray-300 hover:text-emerald">Lobby</Link></li>
              <li><Link to="/tournaments" className="text-gray-300 hover:text-emerald">Tournaments</Link></li>
              <li><Link to="/funds" className="text-gray-300 hover:text-emerald">Funds</Link></li>
              <li><Link to="/vip" className="text-gray-300 hover:text-emerald">VIP Program</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gold font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-emerald">How to Play</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald">Rules</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald">FAQ</a></li>
              <li><Link to="/affiliate" className="text-gray-300 hover:text-emerald">Affiliate Program</Link></li>
              <li><Link to="/hof" className="text-gray-300 hover:text-emerald">Hall of Fame</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gold font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-emerald">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald">Responsible Gaming</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-emerald/10 mt-8 pt-6">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Poker P2P. All rights reserved. 18+. Play responsibly.
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            This platform is intended for entertainment purposes only. Virtual chips used in the game have no real money value.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
