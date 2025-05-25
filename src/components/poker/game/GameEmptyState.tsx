
import React from 'react';

export const GameEmptyState: React.FC = () => {
  return (
    <div className="p-6 bg-navy/50 rounded-lg border border-emerald/30 text-center">
      <h3 className="text-xl font-medium text-emerald mb-3">No Active Game</h3>
      <p className="text-gray-300 mb-4">There is no active game at this table.</p>
    </div>
  );
};
