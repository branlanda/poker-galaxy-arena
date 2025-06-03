
import React, { Suspense, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyComponentLoaderProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const LazyComponentLoader: React.FC<LazyComponentLoaderProps> = ({
  fallback = <Skeleton className="w-full h-32" />,
  children
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// HOC for lazy loading components
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <LazyComponentLoader fallback={fallback}>
      <Component {...props as P} ref={ref} />
    </LazyComponentLoader>
  ));
  
  WrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
