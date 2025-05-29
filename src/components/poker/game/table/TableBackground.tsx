
import React from 'react';

export const TableBackground: React.FC = () => {
  return (
    <>
      {/* Table felt texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/30 to-emerald-900/50 rounded-full"></div>
      
      {/* Table logo in center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-emerald-800/20 flex items-center justify-center pointer-events-none z-0">
        <span className="text-emerald-200/30 font-bold text-sm">POKER</span>
      </div>
    </>
  );
};
