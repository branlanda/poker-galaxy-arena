
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SystemStatus {
  webApp: {
    status: 'UP' | 'DOWN' | 'DEGRADED' | 'MAINTENANCE';
    uptime: number;
    responseTime: number;
  };
  database: {
    status: 'UP' | 'DOWN' | 'DEGRADED' | 'MAINTENANCE';
    uptime: number;
    connections: number;
  };
  cdn: {
    status: 'UP' | 'DOWN' | 'DEGRADED' | 'MAINTENANCE';
    hitRate: number;
    cacheSize: string;
  };
  security: {
    status: 'UP' | 'DOWN' | 'DEGRADED' | 'MAINTENANCE';
    threatsBlocked: number;
    rateLimit: number;
  };
}

interface PerformanceMetrics {
  cpu: number;
  memory: number;
  apiResponseTime: number;
  dbQueryTime: number;
  pageLoadTime: number;
  activeUsers: number;
  requestsPerMinute: number;
  bandwidth: string;
}

interface BackupStatus {
  totalBackups: number;
  successRate: number;
  totalSize: string;
  recent: Array<{
    id: string;
    name: string;
    timestamp: Date;
    status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';
    size: string;
    duration: string;
  }>;
}

interface CDNStatus {
  hitRate: number;
  bandwidth: string;
  requests: string;
  nodes: number;
  cacheRules: Array<{
    pattern: string;
    ttl: string;
    type: 'STATIC' | 'DYNAMIC' | 'API';
  }>;
}

interface SecurityMetrics {
  rateLimiting: {
    requestsPerMinute: number;
    apiLimit: string;
    blockedIPs: number;
    usage: number;
  };
  ddosProtection: {
    attacksDetected: number;
    trafficBlocked: string;
    lastAttack: string;
    status: 'ACTIVE' | 'INACTIVE';
  };
  recentEvents: Array<{
    id: string;
    type: string;
    description: string;
    sourceIP: string;
    timestamp: Date;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    blocked: boolean;
  }>;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: Date;
  acknowledged: boolean;
  source: string;
}

export function useInfrastructureMonitoring() {
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    webApp: {
      status: 'UP',
      uptime: 99.95,
      responseTime: 120
    },
    database: {
      status: 'UP',
      uptime: 99.99,
      connections: 45
    },
    cdn: {
      status: 'UP',
      hitRate: 95.2,
      cacheSize: '2.4 GB'
    },
    security: {
      status: 'UP',
      threatsBlocked: 147,
      rateLimit: 75
    }
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    cpu: 35,
    memory: 68,
    apiResponseTime: 120,
    dbQueryTime: 25,
    pageLoadTime: 850,
    activeUsers: 234,
    requestsPerMinute: 1250,
    bandwidth: '45.2 MB/s'
  });

  const [backupStatus, setBackupStatus] = useState<BackupStatus>({
    totalBackups: 156,
    successRate: 99.8,
    totalSize: '14.5 GB',
    recent: [
      {
        id: 'backup_1',
        name: 'backup_daily_20250125_030000',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'SUCCESS',
        size: '125.4 MB',
        duration: '2m 15s'
      },
      {
        id: 'backup_2',
        name: 'backup_daily_20250124_030000',
        timestamp: new Date(Date.now() - 27 * 60 * 60 * 1000),
        status: 'SUCCESS',
        size: '124.8 MB',
        duration: '2m 08s'
      },
      {
        id: 'backup_3',
        name: 'backup_daily_20250123_030000',
        timestamp: new Date(Date.now() - 51 * 60 * 60 * 1000),
        status: 'SUCCESS',
        size: '123.9 MB',
        duration: '2m 12s'
      }
    ]
  });

  const [cdnStatus, setCdnStatus] = useState<CDNStatus>({
    hitRate: 95.2,
    bandwidth: '180 GB',
    requests: '25.4K',
    nodes: 12,
    cacheRules: [
      { pattern: '*.css, *.js', ttl: '1 year', type: 'STATIC' },
      { pattern: '*.png, *.jpg, *.webp', ttl: '6 months', type: 'STATIC' },
      { pattern: '/api/public/*', ttl: '5 minutes', type: 'API' },
      { pattern: '/lobby/*', ttl: '30 seconds', type: 'DYNAMIC' }
    ]
  });

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    rateLimiting: {
      requestsPerMinute: 1250,
      apiLimit: '1000/min',
      blockedIPs: 23,
      usage: 75
    },
    ddosProtection: {
      attacksDetected: 5,
      trafficBlocked: '2.1 GB',
      lastAttack: '2 horas ago',
      status: 'ACTIVE'
    },
    recentEvents: [
      {
        id: 'event_1',
        type: 'Rate Limit Exceeded',
        description: 'IP excedió límite de API requests',
        sourceIP: '192.168.1.100',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        severity: 'MEDIUM',
        blocked: true
      },
      {
        id: 'event_2',
        type: 'Suspicious Bot Activity',
        description: 'Patrón de bot detectado en /lobby',
        sourceIP: '10.0.0.45',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        severity: 'LOW',
        blocked: false
      },
      {
        id: 'event_3',
        type: 'DDoS Attempt',
        description: 'Intento de ataque DDoS mitigado',
        sourceIP: '203.45.67.89',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        severity: 'HIGH',
        blocked: true
      }
    ]
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'alert_1',
      title: 'CPU Usage High',
      description: 'CPU usage ha excedido el 80% durante los últimos 10 minutos',
      severity: 'WARNING',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: false,
      source: 'Performance Monitor'
    },
    {
      id: 'alert_2',
      title: 'Database Connection Pool',
      description: 'Pool de conexiones de BD al 90% de capacidad',
      severity: 'WARNING',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      acknowledged: true,
      source: 'Database Monitor'
    },
    {
      id: 'alert_3',
      title: 'Backup Completed',
      description: 'Backup diario completado exitosamente',
      severity: 'INFO',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      acknowledged: true,
      source: 'Backup System'
    }
  ]);

  const { toast } = useToast();

  const refreshMetrics = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulate API call to refresh metrics
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update metrics with slight variations
      setPerformanceMetrics(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        activeUsers: Math.max(100, prev.activeUsers + Math.floor((Math.random() - 0.5) * 20)),
        requestsPerMinute: Math.max(500, prev.requestsPerMinute + Math.floor((Math.random() - 0.5) * 200))
      }));

      console.log('Infrastructure metrics refreshed');
    } catch (error) {
      console.error('Error refreshing metrics:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar las métricas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true }
            : alert
        )
      );

      toast({
        title: "Alerta Reconocida",
        description: "La alerta ha sido marcada como reconocida",
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast({
        title: "Error",
        description: "No se pudo reconocer la alerta",
        variant: "destructive",
      });
    }
  }, [toast]);

  const triggerBackup = useCallback(async () => {
    try {
      const newBackup = {
        id: `backup_manual_${Date.now()}`,
        name: `backup_manual_${new Date().toISOString().slice(0, 19).replace(/:/g, '')}`,
        timestamp: new Date(),
        status: 'IN_PROGRESS' as const,
        size: 'Calculating...',
        duration: 'In progress...'
      };

      setBackupStatus(prev => ({
        ...prev,
        recent: [newBackup, ...prev.recent.slice(0, 4)]
      }));

      toast({
        title: "Backup Iniciado",
        description: "El backup manual ha comenzado",
      });

      // Simulate backup completion
      setTimeout(() => {
        setBackupStatus(prev => ({
          ...prev,
          recent: prev.recent.map(backup => 
            backup.id === newBackup.id
              ? { ...backup, status: 'SUCCESS' as const, size: '126.2 MB', duration: '2m 20s' }
              : backup
          ),
          totalBackups: prev.totalBackups + 1
        }));

        toast({
          title: "Backup Completado",
          description: "El backup manual se completó exitosamente",
        });
      }, 3000);

    } catch (error) {
      console.error('Error triggering backup:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar el backup",
        variant: "destructive",
      });
    }
  }, [toast]);

  const purgeCache = useCallback(async () => {
    try {
      toast({
        title: "Limpiando Caché",
        description: "Iniciando purga de caché CDN...",
      });

      // Simulate cache purge
      setTimeout(() => {
        setCdnStatus(prev => ({
          ...prev,
          hitRate: 0, // Reset hit rate temporarily
        }));

        toast({
          title: "Caché Limpiado",
          description: "El caché CDN ha sido purgado exitosamente",
        });

        // Restore hit rate gradually
        setTimeout(() => {
          setCdnStatus(prev => ({
            ...prev,
            hitRate: 95.2,
          }));
        }, 5000);
      }, 2000);

    } catch (error) {
      console.error('Error purging cache:', error);
      toast({
        title: "Error",
        description: "No se pudo limpiar el caché",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    systemStatus,
    performanceMetrics,
    backupStatus,
    cdnStatus,
    securityMetrics,
    alerts,
    loading,
    refreshMetrics,
    acknowledgeAlert,
    triggerBackup,
    purgeCache
  };
}
