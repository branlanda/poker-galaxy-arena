
import { useState, useEffect } from 'react';
import { useDeviceInfo } from '@/hooks/use-mobile';

interface MobileOptimizations {
  reducedAnimations: boolean;
  compactMode: boolean;
  reducedData: boolean;
  optimizedScrolling: boolean;
  touchOptimized: boolean;
}

export function useMobileOptimizations(): MobileOptimizations {
  const { isMobile, deviceType } = useDeviceInfo();
  const [optimizations, setOptimizations] = useState<MobileOptimizations>({
    reducedAnimations: false,
    compactMode: false,
    reducedData: false,
    optimizedScrolling: false,
    touchOptimized: false,
  });
  
  useEffect(() => {
    const updateOptimizations = () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check connection type for data saving
      const connection = (navigator as any).connection;
      const isSlowConnection = connection && (
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' ||
        connection.saveData
      );
      
      // Check for low-power mode or low-end device
      const isLowPowerMode = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
      
      setOptimizations({
        reducedAnimations: prefersReducedMotion || isMobile || isLowPowerMode,
        compactMode: isMobile || deviceType === 'mobile',
        reducedData: isSlowConnection || isLowPowerMode,
        optimizedScrolling: isMobile,
        touchOptimized: isMobile || 'ontouchstart' in window,
      });
    };
    
    updateOptimizations();
    
    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', updateOptimizations);
    
    return () => {
      mediaQuery.removeEventListener('change', updateOptimizations);
    };
  }, [isMobile, deviceType]);
  
  return optimizations;
}

// Hook for performance monitoring
export function usePerformanceMonitor() {
  useEffect(() => {
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('LCP:', entry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      
      // Monitor Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            console.log('CLS:', (entry as any).value);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      
      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);
}
