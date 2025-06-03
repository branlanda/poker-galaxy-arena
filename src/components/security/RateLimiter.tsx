
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { useLogger } from '@/components/logging/CentralizedLogger';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitContextType {
  isRateLimited: (action: string) => boolean;
  checkRateLimit: (action: string, config?: Partial<RateLimitConfig>) => Promise<boolean>;
  getRemainingRequests: (action: string) => number;
}

const RateLimitContext = createContext<RateLimitContextType | null>(null);

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  api_call: { maxRequests: 100, windowMs: 60 * 1000, blockDurationMs: 60 * 1000 }, // 100 calls per minute
  game_action: { maxRequests: 30, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 }, // 30 actions per minute
  chat_message: { maxRequests: 10, windowMs: 60 * 1000, blockDurationMs: 2 * 60 * 1000 }, // 10 messages per minute
  table_creation: { maxRequests: 3, windowMs: 10 * 60 * 1000, blockDurationMs: 10 * 60 * 1000 }, // 3 tables per 10 minutes
};

export const RateLimiterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const logger = useLogger();
  const [rateLimitData, setRateLimitData] = useState<Record<string, any>>({});

  const getUserKey = (action: string) => {
    const baseKey = user?.id || 'anonymous';
    return `${baseKey}:${action}`;
  };

  const isRateLimited = (action: string): boolean => {
    const key = getUserKey(action);
    const data = rateLimitData[key];
    
    if (!data) return false;
    
    const now = Date.now();
    return data.blockedUntil && now < data.blockedUntil;
  };

  const checkRateLimit = async (action: string, customConfig?: Partial<RateLimitConfig>): Promise<boolean> => {
    const config = { ...DEFAULT_CONFIGS[action], ...customConfig };
    const key = getUserKey(action);
    const now = Date.now();
    
    setRateLimitData(prev => {
      const current = prev[key] || { requests: [], blockedUntil: null };
      
      // Remove old requests outside the window
      const validRequests = current.requests.filter((timestamp: number) => 
        now - timestamp < config.windowMs
      );
      
      // Check if currently blocked
      if (current.blockedUntil && now < current.blockedUntil) {
        logger.warn(`Rate limit exceeded for action: ${action}`, {
          component: 'RateLimiter',
          action,
          userId: user?.id,
          remainingBlockTime: current.blockedUntil - now
        });
        return prev;
      }
      
      // Check if adding this request would exceed the limit
      if (validRequests.length >= config.maxRequests) {
        const blockedUntil = now + config.blockDurationMs;
        
        logger.warn(`Rate limit triggered for action: ${action}`, {
          component: 'RateLimiter',
          action,
          userId: user?.id,
          requestCount: validRequests.length,
          maxRequests: config.maxRequests,
          blockedUntil: new Date(blockedUntil).toISOString()
        });
        
        // Trigger DDoS protection for suspicious activity
        if (validRequests.length > config.maxRequests * 2) {
          logger.error(`Potential DDoS attack detected for action: ${action}`, undefined, {
            component: 'RateLimiter',
            action,
            userId: user?.id,
            requestCount: validRequests.length,
            suspiciousActivity: true
          });
        }
        
        return {
          ...prev,
          [key]: {
            requests: validRequests,
            blockedUntil
          }
        };
      }
      
      // Add the current request
      validRequests.push(now);
      
      return {
        ...prev,
        [key]: {
          requests: validRequests,
          blockedUntil: null
        }
      };
    });
    
    return !isRateLimited(action);
  };

  const getRemainingRequests = (action: string): number => {
    const config = DEFAULT_CONFIGS[action];
    if (!config) return 0;
    
    const key = getUserKey(action);
    const data = rateLimitData[key];
    
    if (!data) return config.maxRequests;
    
    const now = Date.now();
    const validRequests = data.requests.filter((timestamp: number) => 
      now - timestamp < config.windowMs
    );
    
    return Math.max(0, config.maxRequests - validRequests.length);
  };

  return (
    <RateLimitContext.Provider value={{ isRateLimited, checkRateLimit, getRemainingRequests }}>
      {children}
    </RateLimitContext.Provider>
  );
};

export const useRateLimit = () => {
  const context = useContext(RateLimitContext);
  if (!context) {
    throw new Error('useRateLimit must be used within RateLimiterProvider');
  }
  return context;
};
