
import React from 'react';
import { Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface KycBadgeProps {
  level: 0 | 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
}

const KycBadge: React.FC<KycBadgeProps> = ({ level, size = 'sm' }) => {
  const { t } = useTranslation();
  
  const getBadgeColors = () => {
    switch (level) {
      case 0:
        return 'bg-red-500/20 text-red-400';
      case 1:
        return 'bg-amber-500/20 text-amber-400';
      case 2:
        return 'bg-blue-500/20 text-blue-400';
      case 3:
        return 'bg-emerald/20 text-emerald';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'md':
        return 'text-sm px-3 py-1';
      case 'lg':
        return 'text-base px-4 py-1.5';
      default:
        return 'text-xs px-2 py-0.5';
    }
  };
  
  return (
    <div className={`inline-flex items-center gap-1 rounded-full ${getBadgeColors()} ${getSizeClasses()}`}>
      <Shield className={size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} />
      <span>KYC {level}</span>
    </div>
  );
};

export default KycBadge;
