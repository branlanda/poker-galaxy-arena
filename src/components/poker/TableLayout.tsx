
import React, { ReactNode } from 'react';

interface TableLayoutProps {
  pot: number;
  children: ReactNode;
}

export function TableLayout({ pot, children }: TableLayoutProps) {
  return (
    <div className="relative w-full h-[450px] rounded-full bg-emerald-900/90 border-8 border-emerald-950/70 shadow-lg overflow-hidden">
      {/* Felt background */}
      <div className="absolute inset-0 bg-[url('/felt-texture.png')] opacity-30"></div>
      
      {/* Table content */}
      <div className="relative h-full flex items-center justify-center">
        {/* Pot display */}
        {pot > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-16 z-10">
            <div className="bg-black/60 px-4 py-1 rounded-full">
              <span className="text-white font-bold">Pot: {pot}</span>
            </div>
          </div>
        )}
        
        {/* Pass through all child elements (seats, cards, etc) */}
        {children}
      </div>
    </div>
  );
}
