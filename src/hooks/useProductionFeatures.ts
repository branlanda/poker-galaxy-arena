
import { useEffect } from 'react';
import { useAnalytics } from '@/components/analytics/AnalyticsProvider';
import { useLogger } from '@/components/logging/CentralizedLogger';
import { useRateLimit } from '@/components/security/RateLimiter';
import { useSEO } from '@/components/seo/SEOProvider';

export const useProductionFeatures = () => {
  const analytics = useAnalytics();
  const logger = useLogger();
  const rateLimit = useRateLimit();
  const seo = useSEO();

  // Performance monitoring
  useEffect(() => {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const metric = {
            name: entry.name,
            value: entry.value || entry.duration,
            rating: 'good' // This would be calculated based on thresholds
          };

          analytics.track('performance_metric', metric);
          
          // Log poor performance
          if (entry.name === 'LCP' && (entry.value || 0) > 2500) {
            logger.warn('Poor LCP performance detected', { 
              component: 'PerformanceMonitoring',
              metric: entry.name,
              value: entry.value 
            });
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

      return () => observer.disconnect();
    }
  }, [analytics, logger]);

  // Error boundary integration
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logger.error('Unhandled error', new Error(event.message), {
        component: 'GlobalErrorHandler',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });

      analytics.track('error_occurred', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection', new Error(String(event.reason)), {
        component: 'GlobalErrorHandler',
        reason: event.reason
      });

      analytics.track('promise_rejection', {
        reason: String(event.reason)
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [logger, analytics]);

  // Network monitoring
  useEffect(() => {
    const handleOnline = () => {
      logger.info('Network connection restored');
      analytics.track('network_status', { status: 'online' });
    };

    const handleOffline = () => {
      logger.warn('Network connection lost');
      analytics.track('network_status', { status: 'offline' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [logger, analytics]);

  return {
    analytics,
    logger,
    rateLimit,
    seo
  };
};
