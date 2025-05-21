
import React from 'react';
import { Link } from 'react-router-dom';
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
              <a href="#" className="text-emerald hover:text-emerald/80">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-emerald hover:text-emerald/80">
                <span className="sr-only">Discord</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 8a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3z"></path>
                  <circle cx="11" cy="10" r="1"></circle>
                  <circle cx="13" cy="14" r="1"></circle>
                </svg>
              </a>
              <a href="#" className="text-emerald hover:text-emerald/80">
                <span className="sr-only">Telegram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-gold font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/lobby" className="text-gray-300 hover:text-emerald">Lobby</Link></li>
              <li><Link to="/tournament" className="text-gray-300 hover:text-emerald">Tournaments</Link></li>
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
