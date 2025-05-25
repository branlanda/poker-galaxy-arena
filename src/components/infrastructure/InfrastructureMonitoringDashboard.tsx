
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInfrastructureMonitoring } from '@/hooks/useInfrastructureMonitoring';
import { 
  Server, 
  Database, 
  Globe, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  HardDrive,
  Clock,
  Zap,
  Activity
} from 'lucide-react';

const InfrastructureMonitoringDashboard: React.FC = () => {
  const {
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
  } = useInfrastructureMonitoring();

  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMetrics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshMetrics, refreshInterval]);

  const getStatusBadge = (status: string) => {
    const colors = {
      'UP': 'bg-green-500',
      'DOWN': 'bg-red-500',
      'DEGRADED': 'bg-yellow-500',
      'MAINTENANCE': 'bg-blue-500'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-500'}>{status}</Badge>;
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-green-500';
    if (uptime >= 99.0) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 bg-navy min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-navy min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Server className="h-8 w-8 text-emerald" />
          <h1 className="text-3xl font-bold text-white">Monitoreo de Infraestructura</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={refreshMetrics} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Badge variant="outline" className="text-emerald border-emerald">
            Auto-refresh: {refreshInterval / 1000}s
          </Badge>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.filter(alert => alert.severity === 'CRITICAL').length > 0 && (
        <Alert className="mb-6 border-red-500 bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-500">
            {alerts.filter(alert => alert.severity === 'CRITICAL').length} alertas críticas requieren atención inmediata
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-navy-light">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="cdn">CDN</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-navy-light border-emerald/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Aplicación Web
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {getStatusBadge(systemStatus.webApp.status)}
                  <span className={`text-sm font-medium ${getUptimeColor(systemStatus.webApp.uptime)}`}>
                    {systemStatus.webApp.uptime}% uptime
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Respuesta: {systemStatus.webApp.responseTime}ms
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-light border-emerald/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Base de Datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {getStatusBadge(systemStatus.database.status)}
                  <span className={`text-sm font-medium ${getUptimeColor(systemStatus.database.uptime)}`}>
                    {systemStatus.database.uptime}% uptime
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Conexiones: {systemStatus.database.connections}/100
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-light border-emerald/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  CDN
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {getStatusBadge(systemStatus.cdn.status)}
                  <span className="text-sm font-medium text-emerald">
                    {systemStatus.cdn.hitRate}% hit rate
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Caché: {systemStatus.cdn.cacheSize}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-light border-emerald/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {getStatusBadge(systemStatus.security.status)}
                  <span className="text-sm font-medium text-emerald">
                    {systemStatus.security.threatsBlocked} bloqueadas
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Rate limit: {systemStatus.security.rateLimit}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">Alertas Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-navy rounded border border-emerald/10">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-4 w-4 ${
                        alert.severity === 'CRITICAL' ? 'text-red-500' :
                        alert.severity === 'WARNING' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <div className="text-white font-medium">{alert.title}</div>
                        <div className="text-sm text-gray-400">{alert.description}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.acknowledged ? 'secondary' : 'destructive'}>
                        {alert.acknowledged ? 'Reconocida' : alert.severity}
                      </Badge>
                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Reconocer
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-navy-light border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  CPU y Memoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">CPU</span>
                    <span className="text-white">{performanceMetrics.cpu}%</span>
                  </div>
                  <Progress value={performanceMetrics.cpu} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Memoria</span>
                    <span className="text-white">{performanceMetrics.memory}%</span>
                  </div>
                  <Progress value={performanceMetrics.memory} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-light border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tiempos de Respuesta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">API Promedio</span>
                  <span className="text-white">{performanceMetrics.apiResponseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Base de Datos</span>
                  <span className="text-white">{performanceMetrics.dbQueryTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Página Completa</span>
                  <span className="text-white">{performanceMetrics.pageLoadTime}ms</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-light border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Tráfico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Usuarios Activos</span>
                  <span className="text-white">{performanceMetrics.activeUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Requests/min</span>
                  <span className="text-white">{performanceMetrics.requestsPerMinute}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ancho de Banda</span>
                  <span className="text-white">{performanceMetrics.bandwidth}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backups" className="space-y-6">
          {/* Database Backups */}
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Backups Automáticos
              </CardTitle>
              <Button onClick={triggerBackup} variant="outline" size="sm">
                Crear Backup Manual
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald">{backupStatus.totalBackups}</div>
                  <div className="text-sm text-gray-400">Total Backups</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald">{backupStatus.successRate}%</div>
                  <div className="text-sm text-gray-400">Tasa de Éxito</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald">{backupStatus.totalSize}</div>
                  <div className="text-sm text-gray-400">Tamaño Total</div>
                </div>
              </div>

              <div className="space-y-3">
                {backupStatus.recent.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-3 bg-navy rounded border border-emerald/10">
                    <div>
                      <div className="text-white font-medium">{backup.name}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(backup.timestamp).toLocaleString()} - {backup.size}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={backup.status === 'SUCCESS' ? 'default' : 'destructive'}>
                        {backup.status}
                      </Badge>
                      <span className="text-sm text-gray-400">{backup.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cdn" className="space-y-6">
          {/* CDN Management */}
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Red de Distribución de Contenido
              </CardTitle>
              <Button onClick={purgeCache} variant="outline" size="sm">
                Limpiar Caché
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald">{cdnStatus.hitRate}%</div>
                  <div className="text-sm text-gray-400">Hit Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald">{cdnStatus.bandwidth}</div>
                  <div className="text-sm text-gray-400">Bandwidth Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald">{cdnStatus.requests}</div>
                  <div className="text-sm text-gray-400">Requests/min</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald">{cdnStatus.nodes}</div>
                  <div className="text-sm text-gray-400">Nodos Activos</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-medium">Configuración de Caché</h4>
                {cdnStatus.cacheRules.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-navy rounded border border-emerald/10">
                    <div>
                      <div className="text-white font-medium">{rule.pattern}</div>
                      <div className="text-sm text-gray-400">TTL: {rule.ttl}</div>
                    </div>
                    <Badge variant="outline">{rule.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security and Rate Limiting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-navy-light border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Rate Limiting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Requests/Minuto</span>
                  <span className="text-white">{securityMetrics.rateLimiting.requestsPerMinute}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Límite API</span>
                  <span className="text-white">{securityMetrics.rateLimiting.apiLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IPs Bloqueadas</span>
                  <span className="text-white">{securityMetrics.rateLimiting.blockedIPs}</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Uso del Límite</span>
                    <span className="text-white">{securityMetrics.rateLimiting.usage}%</span>
                  </div>
                  <Progress value={securityMetrics.rateLimiting.usage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-light border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Protección DDoS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ataques Detectados</span>
                  <span className="text-white">{securityMetrics.ddosProtection.attacksDetected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tráfico Bloqueado</span>
                  <span className="text-white">{securityMetrics.ddosProtection.trafficBlocked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Último Ataque</span>
                  <span className="text-white">{securityMetrics.ddosProtection.lastAttack}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Estado:</span>
                  <Badge variant={securityMetrics.ddosProtection.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {securityMetrics.ddosProtection.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Events */}
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">Eventos de Seguridad Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityMetrics.recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-navy rounded border border-emerald/10">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-4 w-4 ${
                        event.severity === 'HIGH' ? 'text-red-500' :
                        event.severity === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <div className="text-white font-medium">{event.type}</div>
                        <div className="text-sm text-gray-400">{event.description}</div>
                        <div className="text-xs text-gray-500">
                          IP: {event.sourceIP} - {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={event.blocked ? 'destructive' : 'secondary'}>
                      {event.blocked ? 'Bloqueado' : 'Monitoreado'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfrastructureMonitoringDashboard;
