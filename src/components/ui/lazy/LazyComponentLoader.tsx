
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
export function withLazyLoading<T extends Record<string, any>>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  return React.forwardRef<any, T>((props, ref) => (
    <LazyComponentLoader fallback={fallback}>
      <Component {...props} />
    </LazyComponentLoader>
  ));
}
