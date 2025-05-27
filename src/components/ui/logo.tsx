
import React from 'react';
import { Logo as AssetLogo } from '@/assets/Logo';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  return <AssetLogo size={size} className={className} />;
};

export default Logo;
