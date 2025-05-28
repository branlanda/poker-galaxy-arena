import React from 'react';
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };
  return <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 48 48" className={`${sizeClasses[size]}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4L6 14V34L24 44L42 34V14L24 4Z" fill="#0B1F32" stroke="#1CC29F" strokeWidth="2" />
            <path d="M24 4L42 14L24 24L6 14L24 4Z" fill="#0B1F32" stroke="#1CC29F" strokeWidth="2" />
            <path d="M24 44V24M6 14V34M42 14V34" stroke="#1CC29F" strokeWidth="2" />
            <circle cx="24" cy="24" r="8" fill="#0B1F32" stroke="#E4C770" strokeWidth="2" />
            <path d="M21 24H27M24 21V27" stroke="#E4C770" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold leading-none ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'} text-white`}>
          Poker<span className="text-emerald">Galaxy</span>
        </span>
        {size !== 'sm' && <span className="text-xs text-gold font-semibold tracking-wider leading-none">
            PREMIUM POKER EXPERIENCE
          </span>}
      </div>
    </div>;
};
export default Logo;