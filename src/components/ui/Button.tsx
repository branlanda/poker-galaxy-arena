
import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, children, ...props }, ref) => {
    const variants = {
      default: 'bg-muted text-foreground hover:bg-muted/80',
      primary: 'bg-emerald text-white hover:bg-emerald/90 shadow-md shadow-emerald/20',
      secondary: 'bg-gold text-navy hover:bg-gold/90 shadow-md shadow-gold/20',
      accent: 'bg-accent text-white hover:bg-accent/90 shadow-md shadow-accent/20',
      outline: 'border border-emerald text-emerald hover:bg-emerald/10',
      link: 'bg-transparent text-emerald underline-offset-4 hover:underline hover:text-emerald/90'
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg'
    };

    return (
      <button
        className={cn(
          'relative inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white" />
          </div>
        )}
        <span className={loading ? 'opacity-0' : ''}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
