
import React, { ReactNode } from 'react';

interface TableLayoutProps {
  pot: number;
  children: ReactNode;
}

export function TableLayout({ pot, children }: TableLayoutProps) {
  return (
    <div className="relative w-full h-[450px] rounded-full bg-gradient-to-br from-green-800 via-green-700 to-green-900 border-8 border-amber-900/70 shadow-2xl overflow-hidden">
      {/* Felt texture overlay */}
      <div className="absolute inset-0 bg-[url('/felt-texture.png')] opacity-20"></div>
      
      {/* Additional felt pattern */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-green-800/20 to-green-900/40"></div>
      
      {/* Table content */}
      <div className="relative h-full flex items-center justify-center">
        {/* Pot display */}
        {pot > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-16 z-10">
            <div className="bg-black/60 px-4 py-1 rounded-full border border-gold/30">
              <span className="text-gold font-bold text-lg">Pot: ${pot}</span>
            </div>
          </div>
        )}
        
        {/* Pass through all child elements (seats, cards, etc) */}
        {children}
      </div>
    </div>
  );
}
