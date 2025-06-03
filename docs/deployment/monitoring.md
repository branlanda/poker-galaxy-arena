
# Monitoring Setup

Comprehensive monitoring for your poker application.

## Health Checks

### Application Health
```typescript
// src/utils/healthCheck.ts
export const healthCheck = async () => {
  const checks = {
    database: await checkDatabase(),
    cache: await checkCache(),
    external: await checkExternalServices(),
  };
  
  return {
    status: Object.values(checks).every(Boolean) ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  };
};
```

### Database Health
```typescript
// Database connectivity
const checkDatabase = async () => {
  try {
    const { error } = await supabase.from('health_check').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};
```

### API Endpoint
```typescript
// api/health.ts
export default async function handler(req: Request) {
  const health = await healthCheck();
  
  return new Response(JSON.stringify(health), {
    status: health.status === 'healthy' ? 200 : 503,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## Performance Monitoring

### Core Web Vitals
```typescript
// src/utils/performance.ts
import { onCLS, onFID, onLCP } from 'web-vitals';

export const initializePerformanceMonitoring = () => {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
};

const sendToAnalytics = (metric: any) => {
  // Send to your analytics service
  console.log(metric);
};
```

### Real User Monitoring
```typescript
// src/hooks/usePerformanceMonitoring.ts
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Track page load time
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const loadTime = entry.loadEventEnd - entry.loadEventStart;
          trackMetric('page_load_time', loadTime);
        }
      });
    });
    
    observer.observe({ entryTypes: ['navigation'] });
    
    return () => observer.disconnect();
  }, []);
};
```

## Error Tracking

### Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to error tracking service
    sendErrorToService({
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

### Global Error Handler
```typescript
// src/utils/errorTracking.ts
window.addEventListener('error', (event) => {
  sendErrorToService({
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack
  });
});

window.addEventListener('unhandledrejection', (event) => {
  sendErrorToService({
    type: 'unhandled_promise_rejection',
    reason: event.reason
  });
});
```

## Metrics Collection

### Custom Metrics
```typescript
// src/utils/metrics.ts
export class MetricsCollector {
  private metrics: Metric[] = [];
  
  track(name: string, value: number, tags?: Record<string, string>) {
    this.metrics.push({
      name,
      value,
      tags,
      timestamp: Date.now()
    });
    
    if (this.metrics.length >= 100) {
      this.flush();
    }
  }
  
  private async flush() {
    const metricsToSend = [...this.metrics];
    this.metrics = [];
    
    await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metricsToSend)
    });
  }
}
```

### Business Metrics
```typescript
// src/hooks/useBusinessMetrics.ts
export const useBusinessMetrics = () => {
  const trackGameStart = (tableId: string, playerCount: number) => {
    metrics.track('game_started', 1, {
      table_id: tableId,
      player_count: playerCount.toString()
    });
  };
  
  const trackPlayerAction = (action: string, amount?: number) => {
    metrics.track('player_action', 1, {
      action,
      amount: amount?.toString()
    });
  };
  
  return { trackGameStart, trackPlayerAction };
};
```

## Alerting

### Alert Rules
```typescript
// src/utils/alerts.ts
interface AlertRule {
  name: string;
  condition: (metrics: Metric[]) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

const alertRules: AlertRule[] = [
  {
    name: 'High Error Rate',
    condition: (metrics) => {
      const errorRate = calculateErrorRate(metrics);
      return errorRate > 0.05; // 5%
    },
    severity: 'high',
    message: 'Error rate exceeds 5%'
  },
  {
    name: 'Slow Database Queries',
    condition: (metrics) => {
      const avgQueryTime = calculateAvgQueryTime(metrics);
      return avgQueryTime > 2000; // 2 seconds
    },
    severity: 'medium',
    message: 'Database queries are slow'
  }
];
```

### Notification Channels
```typescript
// src/utils/notifications.ts
export const sendAlert = async (alert: Alert) => {
  // Email notification
  await sendEmail({
    to: 'alerts@yourdomain.com',
    subject: `[${alert.severity.toUpperCase()}] ${alert.name}`,
    body: alert.message
  });
  
  // Slack notification
  await sendSlackMessage({
    channel: '#alerts',
    text: `🚨 ${alert.name}: ${alert.message}`
  });
  
  // SMS for critical alerts
  if (alert.severity === 'critical') {
    await sendSMS({
      to: '+1234567890',
      message: `CRITICAL: ${alert.name}`
    });
  }
};
```

## Dashboards

### System Dashboard
```typescript
// src/components/monitoring/SystemDashboard.tsx
export const SystemDashboard = () => {
  const [metrics, setMetrics] = useState<Metrics>();
  
  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMetrics(data);
    };
    
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard title="Active Users" value={metrics?.activeUsers} />
      <MetricCard title="Error Rate" value={metrics?.errorRate} />
      <MetricCard title="Response Time" value={metrics?.responseTime} />
      <MetricCard title="Database Load" value={metrics?.dbLoad} />
    </div>
  );
};
```

### Business Dashboard
```typescript
// src/components/monitoring/BusinessDashboard.tsx
export const BusinessDashboard = () => {
  return (
    <div className="space-y-6">
      <RealtimeStats />
      <GameMetrics />
      <PlayerMetrics />
      <RevenueMetrics />
    </div>
  );
};
```

## Log Management

### Structured Logging
```typescript
// src/utils/logger.ts
export class Logger {
  static info(message: string, meta?: Record<string, any>) {
    console.log(JSON.stringify({
      level: 'info',
      message,
      meta,
      timestamp: new Date().toISOString(),
      service: 'poker-app'
    }));
  }
  
  static error(message: string, error?: Error, meta?: Record<string, any>) {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.stack,
      meta,
      timestamp: new Date().toISOString(),
      service: 'poker-app'
    }));
  }
}
```

### Log Aggregation
```bash
# Configure log shipping (example with Fluentd)
# /etc/fluent/fluent.conf
<source>
  @type tail
  path /var/log/poker-app/*.log
  pos_file /var/log/fluentd/poker-app.log.pos
  tag poker-app
  format json
</source>

<match poker-app>
  @type elasticsearch
  host elasticsearch.yourdomain.com
  port 9200
  index_name poker-app
</match>
```

## Third-Party Services

### Sentry Integration
```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter sensitive data
    if (event.request?.data) {
      delete event.request.data.password;
      delete event.request.data.token;
    }
    return event;
  }
});
```

### DataDog Integration
```typescript
// src/utils/datadog.ts
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: process.env.VITE_DATADOG_APP_ID!,
  clientToken: process.env.VITE_DATADOG_CLIENT_TOKEN!,
  site: 'datadoghq.com',
  service: 'poker-app',
  env: process.env.NODE_ENV,
  version: process.env.VITE_APP_VERSION,
  sampleRate: 100,
  trackInteractions: true,
});
```

## Monitoring Checklist

### System Metrics
- [ ] CPU usage
- [ ] Memory usage
- [ ] Disk usage
- [ ] Network I/O
- [ ] Database connections
- [ ] Cache hit rate

### Application Metrics
- [ ] Response times
- [ ] Error rates
- [ ] Throughput
- [ ] User sessions
- [ ] Page load times
- [ ] API endpoint performance

### Business Metrics
- [ ] Active users
- [ ] Games in progress
- [ ] Revenue metrics
- [ ] Player retention
- [ ] Feature usage
- [ ] Conversion rates

### Alerts
- [ ] High error rate
- [ ] Slow response times
- [ ] Database issues
- [ ] High CPU/Memory usage
- [ ] Failed deployments
- [ ] Security incidents

## Next Steps

1. Choose monitoring tools that fit your budget and requirements
2. Set up basic health checks and alerts
3. Implement error tracking
4. Create monitoring dashboards
5. Configure log aggregation
6. Set up automated alerting

## Tools Comparison

| Tool | Type | Cost | Complexity | Features |
|------|------|------|------------|----------|
| Sentry | Error Tracking | Free tier | Low | Error tracking, performance |
| DataDog | Full Stack | Paid | Medium | Metrics, logs, traces |
| New Relic | APM | Paid | Medium | Performance monitoring |
| Grafana | Dashboards | Free | High | Custom dashboards |
| Prometheus | Metrics | Free | High | Time series metrics |
