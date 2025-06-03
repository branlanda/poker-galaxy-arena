
import React from 'react';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { CentralizedLoggerProvider } from '@/components/logging/CentralizedLogger';
import { RateLimiterProvider } from '@/components/security/RateLimiter';
import { SEOProvider } from '@/components/seo/SEOProvider';
import { useProductionFeatures } from '@/hooks/useProductionFeatures';

const ProductionFeaturesInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useProductionFeatures();
  return <>{children}</>;
};

export const ProductionFeatures: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SEOProvider>
      <CentralizedLoggerProvider>
        <AnalyticsProvider>
          <RateLimiterProvider>
            <ProductionFeaturesInner>
              {children}
            </ProductionFeaturesInner>
          </RateLimiterProvider>
        </AnalyticsProvider>
      </CentralizedLoggerProvider>
    </SEOProvider>
  );
};
