
import React from 'react';

interface PokerChipProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PokerChip: React.FC<PokerChipProps> = ({ 
  value, 
  size = 'md', 
  className = '' 
}) => {
  // Determine chip color based on value
  const getChipColor = () => {
    if (value <= 10) return 'bg-white border-gray-500';
    if (value <= 50) return 'bg-red-600 border-red-800';
    if (value <= 100) return 'bg-blue-600 border-blue-800';
    if (value <= 500) return 'bg-green-600 border-green-800';
    if (value <= 1000) return 'bg-black border-gray-800';
    return 'bg-purple-600 border-purple-800';
  };
  
  // Determine size
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };
  
  return (
    <div className={`
      relative rounded-full ${sizeClasses[size]} ${getChipColor()}
      border-4 flex items-center justify-center font-bold text-white
      ${className}
    `}>
      <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
      <div className="absolute inset-2 rounded-full border border-white/10"></div>
      <span>{value}</span>
    </div>
  );
};
