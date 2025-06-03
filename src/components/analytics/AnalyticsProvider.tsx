
import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

interface AnalyticsEvent {
  event_name: string;
  user_id?: string;
  session_id: string;
  page_url: string;
  user_agent: string;
  timestamp: string;
  properties?: Record<string, any>;
}

interface AnalyticsContextType {
  track: (eventName: string, properties?: Record<string, any>) => void;
  trackPageView: (page: string) => void;
  trackUserAction: (action: string, details?: Record<string, any>) => void;
  trackGameEvent: (event: string, gameData?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const sessionId = React.useMemo(() => crypto.randomUUID(), []);

  const track = async (eventName: string, properties?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      event_name: eventName,
      user_id: user?.id,
      session_id: sessionId,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      properties
    };

    try {
      await supabase.from('analytics_events').insert(event);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  const trackPageView = (page: string) => {
    track('page_view', { page });
  };

  const trackUserAction = (action: string, details?: Record<string, any>) => {
    track('user_action', { action, ...details });
  };

  const trackGameEvent = (event: string, gameData?: Record<string, any>) => {
    track('game_event', { event, ...gameData });
  };

  // Track initial page view
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  // Track page navigation
  useEffect(() => {
    const handlePopState = () => {
      trackPageView(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <AnalyticsContext.Provider value={{ track, trackPageView, trackUserAction, trackGameEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};
