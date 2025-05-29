
import React from 'react';

export const TableBackground: React.FC = () => {
  return (
    <>
      {/* Table felt texture overlay */}
      <div className="absolute inset-0 bg-gray-100 rounded-full border border-black"></div>
      
      {/* Table logo in center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white border-2 border-black flex items-center justify-center pointer-events-none z-0">
        <span className="text-black font-bold text-sm">POKER</span>
      </div>
    </>
  );
};
