
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, WifiOff, Database, Server, AlertTriangle } from 'lucide-react';

interface HealthStatus {
  database: 'healthy' | 'degraded' | 'down';
  realtime: 'healthy' | 'degraded' | 'down';
  api: 'healthy' | 'degraded' | 'down';
  lastCheck: Date;
}

export const HealthCheck: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus>({
    database: 'healthy',
    realtime: 'healthy',
    api: 'healthy',
    lastCheck: new Date()
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    const newHealth: HealthStatus = {
      database: 'down',
      realtime: 'down',
      api: 'down',
      lastCheck: new Date()
    };

    try {
      // Test database connection
      const { error: dbError } = await supabase
        .from('lobby_tables')
        .select('id')
        .limit(1);
      
      newHealth.database = dbError ? 'degraded' : 'healthy';

      // Test realtime connection
      const channel = supabase.channel('health-check');
      const subscription = channel.subscribe((status) => {
        newHealth.realtime = status === 'SUBSCRIBED' ? 'healthy' : 'degraded';
      });
      
      // Clean up subscription
      setTimeout(() => {
        subscription.unsubscribe();
      }, 2000);

      // Test API response time
      const start = Date.now();
      const { error: apiError } = await supabase.auth.getSession();
      const responseTime = Date.now() - start;
      
      if (apiError) {
        newHealth.api = 'down';
      } else if (responseTime > 2000) {
        newHealth.api = 'degraded';
      } else {
        newHealth.api = 'healthy';
      }

    } catch (error) {
      console.error('Health check failed:', error);
    }

    setHealth(newHealth);
    setIsChecking(false);
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (service: string, status: string) => {
    const iconClass = `h-4 w-4 ${status === 'healthy' ? 'text-green-600' : status === 'degraded' ? 'text-yellow-600' : 'text-red-600'}`;
    
    switch (service) {
      case 'database': return <Database className={iconClass} />;
      case 'realtime': return status === 'healthy' ? <Wifi className={iconClass} /> : <WifiOff className={iconClass} />;
      case 'api': return <Server className={iconClass} />;
      default: return <AlertTriangle className={iconClass} />;
    }
  };

  const overallHealth = Object.values(health).slice(0, 3).every(status => status === 'healthy') ? 'healthy' : 
                       Object.values(health).slice(0, 3).some(status => status === 'down') ? 'down' : 'degraded';

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          System Health
          <Badge className={getStatusColor(overallHealth)}>
            {overallHealth.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(health).slice(0, 3).map(([service, status]) => (
          <div key={service} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(service, status)}
              <span className="text-sm capitalize">{service}</span>
            </div>
            <Badge variant="outline" className={`${getStatusColor(status)} text-white`}>
              {status.toUpperCase()}
            </Badge>
          </div>
        ))}
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            Last check: {health.lastCheck.toLocaleTimeString()}
            {isChecking && <span className="ml-2">Checking...</span>}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
