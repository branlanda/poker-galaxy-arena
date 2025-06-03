
import React, { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface MetricsData {
  page: string;
  action: string;
  duration?: number;
  error?: string;
  userId?: string;
  timestamp: Date;
}

class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: MetricsData[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds

  private constructor() {
    this.startAutoFlush();
    this.setupPerformanceObserver();
  }

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  track(data: Omit<MetricsData, 'timestamp'>) {
    this.metrics.push({
      ...data,
      timestamp: new Date()
    });

    if (this.metrics.length >= this.batchSize) {
      this.flush();
    }
  }

  trackPageView(page: string, userId?: string) {
    this.track({
      page,
      action: 'page_view',
      userId
    });
  }

  trackError(error: Error, page: string, userId?: string) {
    this.track({
      page,
      action: 'error',
      error: error.message,
      userId
    });
  }

  trackPerformance(page: string, duration: number, userId?: string) {
    this.track({
      page,
      action: 'performance',
      duration,
      userId
    });
  }

  private async flush() {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      const { error } = await supabase
        .from('metrics')
        .insert(metricsToSend.map(metric => ({
          page: metric.page,
          action: metric.action,
          duration: metric.duration,
          error_message: metric.error,
          user_id: metric.userId,
          created_at: metric.timestamp.toISOString()
        })));

      if (error) {
        console.error('Failed to send metrics:', error);
        // Re-add metrics to queue for retry
        this.metrics.unshift(...metricsToSend);
      }
    } catch (err) {
      console.error('Metrics collection error:', err);
      // Re-add metrics to queue for retry
      this.metrics.unshift(...metricsToSend);
    }
  }

  private startAutoFlush() {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.track({
            page: window.location.pathname,
            action: 'lcp',
            duration: entry.startTime
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any;
          if (fidEntry.processingStart) {
            this.track({
              page: window.location.pathname,
              action: 'fid',
              duration: fidEntry.processingStart - fidEntry.startTime
            });
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitor Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            this.track({
              page: window.location.pathname,
              action: 'cls',
              duration: clsEntry.value * 1000 // Convert to milliseconds
            });
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }
}

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const collector = MetricsCollector.getInstance();
    
    // Track initial page load
    collector.trackPageView(window.location.pathname);

    // Track navigation
    const handlePopState = () => {
      collector.trackPageView(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    // Track unhandled errors
    const handleError = (event: ErrorEvent) => {
      collector.trackError(
        new Error(event.message), 
        window.location.pathname
      );
    };

    window.addEventListener('error', handleError);

    // Track unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      collector.trackError(
        new Error(event.reason), 
        window.location.pathname
      );
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
};

export { MetricsCollector };
