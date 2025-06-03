
import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  timestamp: string;
  user_id?: string;
  session_id: string;
  component?: string;
  stack_trace?: string;
  metadata?: Record<string, any>;
}

interface LoggerContextType {
  debug: (message: string, metadata?: Record<string, any>) => void;
  info: (message: string, metadata?: Record<string, any>) => void;
  warn: (message: string, metadata?: Record<string, any>) => void;
  error: (message: string, error?: Error, metadata?: Record<string, any>) => void;
  fatal: (message: string, error?: Error, metadata?: Record<string, any>) => void;
}

const LoggerContext = createContext<LoggerContextType | null>(null);

export const CentralizedLoggerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const sessionId = React.useMemo(() => crypto.randomUUID(), []);

  const log = async (level: LogEntry['level'], message: string, error?: Error, metadata?: Record<string, any>) => {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      user_id: user?.id,
      session_id: sessionId,
      component: metadata?.component,
      stack_trace: error?.stack,
      metadata: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...metadata
      }
    };

    // Console logging for development
    const consoleMethod = level === 'fatal' ? 'error' : level;
    console[consoleMethod](`[${level.toUpperCase()}] ${message}`, logEntry);

    try {
      await supabase.from('application_logs').insert(logEntry);
    } catch (err) {
      console.error('Failed to send log to server:', err);
    }
  };

  const debug = (message: string, metadata?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      log('debug', message, undefined, metadata);
    }
  };

  const info = (message: string, metadata?: Record<string, any>) => {
    log('info', message, undefined, metadata);
  };

  const warn = (message: string, metadata?: Record<string, any>) => {
    log('warn', message, undefined, metadata);
  };

  const error = (message: string, error?: Error, metadata?: Record<string, any>) => {
    log('error', message, error, metadata);
  };

  const fatal = (message: string, error?: Error, metadata?: Record<string, any>) => {
    log('fatal', message, error, metadata);
  };

  return (
    <LoggerContext.Provider value={{ debug, info, warn, error, fatal }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = () => {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error('useLogger must be used within CentralizedLoggerProvider');
  }
  return context;
};
