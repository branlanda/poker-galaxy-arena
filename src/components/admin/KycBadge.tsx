
import React from 'react';
import { cn } from '@/lib/utils';

interface KycBadgeProps {
  level: 0 | 1 | 2 | 3;
  size?: 'sm' | 'md';
}

const KycBadge: React.FC<KycBadgeProps> = ({ level, size = 'sm' }) => {
  const getColorClasses = () => {
    switch(level) {
      case 0:
        return 'bg-gray-700/20 text-gray-400';
      case 1:
        return 'bg-amber-700/20 text-amber-400';
      case 2:
        return 'bg-emerald-700/20 text-emerald-400';
      case 3:
        return 'bg-blue-700/20 text-blue-400';
    }
  };

  return (
    <span className={cn(
      'inline-flex items-center justify-center rounded-full font-medium',
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1',
      getColorClasses()
    )}>
      KYC {level}
    </span>
  );
};

export default KycBadge;
