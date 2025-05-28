
import React from 'react';

export const GalacticBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, #1CC29F20 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, #E4C77020 0%, transparent 50%),
            radial-gradient(ellipse at 50% 10%, #60A5FA15 0%, transparent 50%),
            radial-gradient(ellipse at 10% 80%, #A78BFA15 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
};
