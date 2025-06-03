
import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  placeholder?: string;
  quality?: number;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback = '/placeholder.svg',
  placeholder,
  quality = 75,
  sizes,
  priority = false,
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder || fallback);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const isInView = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '100px',
  });
  
  useEffect(() => {
    if ((isInView || priority) && !isLoaded && !isError) {
      const img = new Image();
      
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      
      img.onerror = () => {
        setCurrentSrc(fallback);
        setIsError(true);
        onError?.();
      };
      
      // Generate optimized src with quality parameter
      const optimizedSrc = src.includes('?') 
        ? `${src}&q=${quality}` 
        : `${src}?q=${quality}`;
      
      img.src = optimizedSrc;
    }
  }, [isInView, priority, src, fallback, quality, isLoaded, isError, onLoad, onError]);
  
  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      sizes={sizes}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-70',
        className
      )}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  );
};
